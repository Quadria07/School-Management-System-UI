<?php
// api/auth/create_test_user.php
// RUN THIS ONCE TO CREATE A TEST ADMIN USER, THEN DELETE

require_once '../db_connect.php';

$email = "teacher@test.com";
$password = "password123";
$role = "teacher";
$fullName = "Test User (Teacher)";

// Check if user exists
$stmt = $pdo->prepare("SELECT id FROM profiles WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(["status" => "error", "message" => "Test user already exists!"]);
    exit;
}

// Generate UUID
function guidv4($data = null) {
    // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
    $data = $data ?? random_bytes(16);
    assert(strlen($data) == 16);

    // Set version to 0100
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    // Set bits 6-7 to 10
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

    // Output the 36 character UUID.
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

$id = guidv4();
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

try {
    $sql = "INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id, $email, $passwordHash, $fullName, $role]);

    echo json_encode([
        "status" => "success", 
        "message" => "Test user created successfully!",
        "credentials" => [
            "email" => $email,
            "password" => $password
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
