<?php
// api/auth/create_test_student.php
require_once '../db_connect.php';

$email = "student@test.com";
$password = "password123";
$role = "student";
$fullName = "Test User (Student)";
$studentId = "STD/2026/001";

// Check if user exists
$stmt = $pdo->prepare("SELECT id FROM profiles WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(["status" => "error", "message" => "Test student already exists!"]);
    exit;
}

// Generate UUID
function guidv4($data = null) {
    if (function_exists('random_bytes')) {
        $data = $data ?? random_bytes(16);
    } elseif (function_exists('openssl_random_pseudo_bytes')) {
        $data = $data ?? openssl_random_pseudo_bytes(16);
    } else {
        $data = $data ?? substr(str_shuffle("0123456789abcdef"), 0, 16);
    }
    
    assert(strlen($data) == 16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

$id = guidv4();
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

try {
    $sql = "INSERT INTO profiles (id, email, password_hash, full_name, role, student_id) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id, $email, $passwordHash, $fullName, $role, $studentId]);

    echo json_encode([
        "status" => "success", 
        "message" => "Test Student created successfully!",
        "credentials" => [
            "email" => $email,
            "password" => $password
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
