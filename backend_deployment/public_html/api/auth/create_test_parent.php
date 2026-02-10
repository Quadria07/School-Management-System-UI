<?php
// api/auth/create_test_parent.php
require_once '../db_connect.php';

// Creates a test parent user
$email = "parent@test.com";
$password = "password123";
$role = "parent";
$fullName = "Test User (Parent)";

// Verify if exists
$stmt = $pdo->prepare("SELECT id FROM profiles WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) { echo json_encode(["status" => "error", "message" => "Parent exists"]); exit; }

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
    echo json_encode(["status" => "success", "message" => "Parent Created", "credentials" => ["email"=>$email, "password"=>$password]]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
