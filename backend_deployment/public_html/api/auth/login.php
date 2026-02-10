<?php
// api/auth/login.php

// 1. Include Database and JWT
require_once '../db_connect.php';
require_once '../utils/jwt.php';

// 2. Get Raw Input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and Password are required.']);
    exit;
}

$email = trim($input['email']);
$password = trim($input['password']);

try {
    // 3. Fetch User
    // We select specific fields. NOTE: We assume you have a 'password_hash' column.
    // If your imported DB used MD5 or plain text (not recommended), we might need to adjust.
    // Ideally, the DB schema I gave you has 'password_hash'.
    
    $stmt = $pdo->prepare("SELECT id, full_name, role, password_hash, avatar_url FROM profiles WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // 4. Verify User & Password
    // For the FIRST login, since we just imported empty/dummy data, we might not have users with hashed passwords.
    // For PRODUCTION: Use password_verify($password, $user['password_hash'])
    // For TESTING (Temporary): If user exists but verify fails, we check if it is a test account.
    
    $validPassword = false;
    
    if ($user) {
        if (password_verify($password, $user['password_hash'])) {
            $validPassword = true;
        } 
        // FALLBACK for manual inserts or test data that might not be hashed yet
        // REMOVE THIS in production
        elseif ($user['password_hash'] === $password) {
             $validPassword = true;
        }
    }

    if ($user && $validPassword) {
        // 5. Generate Token
        $issuedAt = time();
        $expirationTime = $issuedAt + (60 * 60 * 24); // Valid for 1 day
        $payload = array(
            'iss' => 'bfoia_school_system',
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => [
                'id' => $user['id'],
                'role' => $user['role'],
                'full_name' => $user['full_name']
            ]
        );

        $jwt = JWT::encode($payload, JWT_SECRET);

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful.',
            'token' => $jwt,
            'user' => [
                'id' => $user['id'],
                'full_name' => $user['full_name'],
                'role' => $user['role'],
                'avatar_url' => $user['avatar_url']
            ]
        ]);
        
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'Invalid credentials.']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Login processing error: ' . $e->getMessage()]);
}
