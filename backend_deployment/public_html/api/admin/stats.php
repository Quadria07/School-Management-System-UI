<?php
// api/admin/stats.php
// Principal/Admin Dashboard Stats
require_once '../db_connect.php';
require_once '../utils/jwt.php';

$token = JWT::getBearerToken();
$payload = JWT::decode($token, JWT_SECRET);

$role = $payload['data']['role'];
$allowed_roles = ['principal', 'proprietor', 'admin', 'superuser'];

if (!$payload || !in_array($role, $allowed_roles)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    // 1. Total Students
    $stmt = $pdo->query("SELECT COUNT(*) FROM profiles WHERE role = 'student'");
    $totalStudents = $stmt->fetchColumn();

    // 2. Total Teachers
    $stmt = $pdo->query("SELECT COUNT(*) FROM profiles WHERE role = 'teacher'");
    $totalTeachers = $stmt->fetchColumn();

    // 3. Pending Approvals (Lesson Notes)
    $stmt = $pdo->query("SELECT COUNT(*) FROM lesson_notes WHERE status = 'pending'");
    $pendingNotes = $stmt->fetchColumn();

    // 4. Fees Collected (Total for this session)
    // Try/Catch specific for this in case table is empty or column missing (though we fixed SQL)
    $stmt = $pdo->query("SELECT COALESCE(SUM(amount_paid), 0) FROM student_fees");
    $totalFees = $stmt->fetchColumn();

    echo json_encode([
        'status' => 'success',
        'data' => [
            'total_students' => $totalStudents,
            'total_teachers' => $totalTeachers,
            'pending_approvals' => $pendingNotes,
            'fees_collected' => $totalFees
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
