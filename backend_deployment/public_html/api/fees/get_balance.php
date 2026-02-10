<?php
// api/fees/get_balance.php
// Student/Parent checks fee status
require_once '../db_connect.php';
require_once '../utils/jwt.php';

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
    if ($role === 'parent') {
        $targetStudentId = $_GET['student_id'] ?? null;
        if (!$targetStudentId) { echo json_encode(['error' => 'Missing student_id']); exit; }
    }

    // In a real app, we need to know the student's Level (JSS 1) to find their fee structure.
    // For this simple test, we will assume we know the fee structure or join tables.
    // Simplifying: We return any 'student_fees' record assigned to them, OR the generic structure for their level.
    
    // 1. Check if specific fee record exists
    $stmt = $pdo->prepare("SELECT total_amount, amount_paid, balance, payment_status FROM student_fees WHERE student_id = ?");
    $stmt->execute([$targetStudentId]);
    $personalFee = $stmt->fetch();

    if ($personalFee) {
        echo json_encode(['status' => 'success', 'data' => $personalFee]);
    } else {
        // Return "Not Billed Yet" or generic info
        echo json_encode(['status' => 'success', 'message' => 'No specific bill generated yet.', 'data' => ['balance' => 0, 'payment_status' => 'none']]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
