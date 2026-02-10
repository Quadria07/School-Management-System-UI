<?php
// api/auth/create_test_admin.php
require_once '../db_connect.php';

// Creates a test Admin (Principal) user
$email = "principal@test.com";
$password = "password123";
$role = "principal";
$fullName = "Mrs. Principal (Admin)";

// Verify if exists
$stmt = $pdo->prepare("SELECT id FROM profiles WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) { echo json_encode(["status" => "error", "message" => "Principal exists"]); exit; }

// UUID Function (reused)
function guidv4($data = null) {
    $data = $data ?? random_bytes(16);
    assert(strlen($data) == 16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

$id = guidv4();
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$id, $email, $passwordHash, $fullName, $role]);
    echo json_encode(["status" => "success", "message" => "Principal Created", "credentials" => ["email"=>$email, "password"=>$password]]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
