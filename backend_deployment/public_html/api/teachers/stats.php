<?php
// api/teachers/stats.php
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
    // 1. Count Total Students (In classes taught by this teacher)
    // Logic: Get distinct students from enrollments in classes where this teacher teaches a subject
    $studentSql = "SELECT COUNT(DISTINCT e.student_id) as total_students 
                   FROM enrollments e 
                   JOIN class_subjects cs ON e.class_id = cs.class_id 
                   WHERE cs.teacher_id = ? AND e.status = 'active'";
    $stmt = $pdo->prepare($studentSql);
    $stmt->execute([$teacherId]);
    $studentCount = $stmt->fetch()['total_students'];

    // 2. Count Classes (Distinct classes teacher is assigned to)
    $classSql = "SELECT COUNT(DISTINCT class_id) as total_classes FROM class_subjects WHERE teacher_id = ?";
    $stmt = $pdo->prepare($classSql);
    $stmt->execute([$teacherId]);
    $classCount = $stmt->fetch()['total_classes'];

    // 3. Count Pending Lesson Notes
    $noteSql = "SELECT COUNT(*) as pending_notes FROM lesson_notes WHERE teacher_id = ? AND status IN ('draft', 'pending', 'rejected')";
    $stmt = $pdo->prepare($noteSql);
    $stmt->execute([$teacherId]);
    $noteCount = $stmt->fetch()['pending_notes'];

    echo json_encode([
        'status' => 'success',
        'data' => [
            'total_students' => $studentCount,
            'total_classes' => $classCount,
            'pending_notes' => $noteCount,
            'hours_taught' => 0 // Placeholder
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
