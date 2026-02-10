<?php
// api/results/upload.php
require_once '../db_connect.php';
require_once '../utils/jwt.php';

// 1. Verify Token (Teacher only)
$token = JWT::getBearerToken();
$payload = JWT::decode($token, JWT_SECRET);

if (!$payload || $payload['data']['role'] !== 'teacher') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized. Only teachers can upload results.']);
    exit;
}

$teacherId = $payload['data']['id'];

// 2. Get Input
$input = json_decode(file_get_contents("php://input"), true);

// Expecting: student_id, class_id, subject_id, ca_score, exam_score, term
if (!isset($input['student_id']) || !isset($input['subject_id']) || !isset($input['term'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: student_id, subject_id, term']);
    exit;
}

// UUID Generation
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

try {
    $ca = floatval($input['ca_score'] ?? 0);
    $exam = floatval($input['exam_score'] ?? 0);
    $total = $ca + $exam;
    
    // Calculate Grade
    $grade = 'F';
    if ($total >= 70) $grade = 'A';
    elseif ($total >= 60) $grade = 'B';
    elseif ($total >= 50) $grade = 'C';
    elseif ($total >= 45) $grade = 'D';
    elseif ($total >= 40) $grade = 'E';

    // Upsert Logic (Insert or Update if exists)
    // We check if result exists for this student+subject+term+session
    $session = $input['academic_session'] ?? '2024/2025';
    
    $checkSql = "SELECT id FROM results WHERE student_id = ? AND subject_id = ? AND term = ? AND academic_session = ?";
    $stmt = $pdo->prepare($checkSql);
    $stmt->execute([$input['student_id'], $input['subject_id'], $input['term'], $session]);
    $existing = $stmt->fetch();

    if ($existing) {
        // Update
        $updateSql = "UPDATE results SET ca_score = ?, exam_score = ?, total_score = ?, grade = ?, teacher_id = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $pdo->prepare($updateSql);
        $stmt->execute([$ca, $exam, $total, $grade, $teacherId, $existing['id']]);
        $resultId = $existing['id'];
        $action = "updated";
    } else {
        // Insert
        $resultId = guidv4();
        $insertSql = "INSERT INTO results (id, student_id, class_id, subject_id, academic_session, term, ca_score, exam_score, total_score, grade, teacher_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')";
        $stmt = $pdo->prepare($insertSql);
        $stmt->execute([
            $resultId, 
            $input['student_id'], 
            $input['class_id'] ?? null, 
            $input['subject_id'], 
            $session, 
            $input['term'], 
            $ca, 
            $exam, 
            $total, 
            $grade, 
            $teacherId
        ]);
        $action = "created";
    }

    echo json_encode(['status' => 'success', 'message' => "Result $action successfully.", 'data' => ['id' => $resultId, 'grade' => $grade, 'total' => $total]]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
