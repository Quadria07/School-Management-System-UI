<?php
// api/results/view.php
require_once '../db_connect.php';
require_once '../utils/jwt.php';

// 1. Verify Token (Student or Parent)
$token = JWT::getBearerToken();
$payload = JWT::decode($token, JWT_SECRET);

if (!$payload) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$role = $payload['data']['role'];
$userId = $payload['data']['id'];

try {
    $targetStudentId = $userId;
    
    // If Parent, they must provide child's ID (in real app we verify relationship)
    if ($role === 'parent') {
        if (!isset($_GET['student_id'])) {
             http_response_code(400);
             echo json_encode(['error' => 'Parent must provide student_id']);
             exit;
        }
        $targetStudentId = $_GET['student_id'];
    }

    $term = $_GET['term'] ?? 'First Term';
    $session = $_GET['session'] ?? '2024/2025';

    $sql = "SELECT r.term, r.ca_score, r.exam_score, r.total_score, r.grade, r.teacher_remarks,
                   s.name as subject_name, s.code as subject_code
            FROM results r
            JOIN subjects s ON r.subject_id = s.id
            WHERE r.student_id = ? AND r.academic_session = ? AND r.term = ?";
            
    // In production, you might restrict this to only 'published' results
    // $sql .= " AND r.status = 'published'";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$targetStudentId, $session, $term]);
    $results = $stmt->fetchAll();

    echo json_encode(['status' => 'success', 'data' => $results]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
