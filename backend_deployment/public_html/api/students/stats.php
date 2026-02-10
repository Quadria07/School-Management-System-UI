<?php
// api/students/stats.php
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
    // 2. Calculate Stats
    // Attendance %
    $attStmt = $pdo->prepare("SELECT COUNT(*) as total, SUM(CASE WHEN status='present' THEN 1 ELSE 0 END) as present FROM student_attendance WHERE student_id = ?");
    $attStmt->execute([$userId]);
    $att = $attStmt->fetch();
    $attendance = ($att['total'] > 0) ? round(($att['present'] / $att['total']) * 100) : 100;

    // Assignments Pending
    // (Simpler proxy: count assignments for student's class that are NOT submitted yet)
    // For now, returning 0 until we implement full assignment logic
    $assignments = 0; 

    // CGPA/Average (Placeholder logic)
    $average = 0;

    echo json_encode([
        'status' => 'success', 
        'data' => [
            'attendance_percentage' => $attendance,
            'assignments_pending' => $assignments,
            'average_score' => $average,
            'term' => 'First Term', // Dynamically fetch from settings later
            'session' => '2024/2025'
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
