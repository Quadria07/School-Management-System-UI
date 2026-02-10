<?php
// api/teachers/classes.php
require_once '../db_connect.php';
require_once '../utils/jwt.php';

$token = JWT::getBearerToken();
$payload = JWT::decode($token, JWT_SECRET);

if (!$payload || $payload['data']['role'] !== 'teacher') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$teacherId = $payload['data']['id'];

try {
    // Fetch classes the teacher teaches
    // Including: Class Name, Level, Subject Taught
    $sql = "SELECT DISTINCT c.id, c.name, c.level, c.capacity, s.name as subject_name
            FROM classes c
            JOIN class_subjects cs ON c.id = cs.class_id
            JOIN subjects s ON cs.subject_id = s.id
            WHERE cs.teacher_id = ?
            ORDER BY c.level, c.name";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$teacherId]);
    $classes = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $classes
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
