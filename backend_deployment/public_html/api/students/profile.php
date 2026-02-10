<?php
// api/students/profile.php
require_once '../db_connect.php';
require_once '../utils/jwt.php';

// 1. Verify Token
$token = JWT::getBearerToken();
$payload = JWT::decode($token, JWT_SECRET);

if (!$payload) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$userId = $payload['data']['id'];

try {
    // 2. Fetch Student Profile with Class Name
    // We join profiles -> enrollments -> classes to get the logic
    $sql = "SELECT p.id, p.full_name, p.email, p.phone_number, p.address, p.date_of_birth, 
            p.student_id, p.department, p.avatar_url,
            c.name as class_name, c.id as class_id
            FROM profiles p
            LEFT JOIN enrollments e ON p.id = e.student_id AND e.status = 'active'
            LEFT JOIN classes c ON e.class_id = c.id
            WHERE p.id = ? AND p.role = 'student'";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $student = $stmt->fetch();

    if (!$student) {
        http_response_code(404);
        echo json_encode(['error' => 'Student profile not found']);
        exit;
    }

    echo json_encode(['status' => 'success', 'data' => $student]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
