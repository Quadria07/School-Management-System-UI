<?php
// api/lesson-notes/create.php
require_once '../db_connect.php';
require_once '../utils/jwt.php';

// 1. Verify Token (Teacher only)
$token = JWT::getBearerToken();
$payload = JWT::decode($token, JWT_SECRET);

if (!$payload || $payload['data']['role'] !== 'teacher') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized. Only teachers can create lesson notes.']);
    exit;
}

$teacherId = $payload['data']['id'];

// 2. Get Input Data
$input = json_decode(file_get_contents("php://input"), true);

// Basic Validation
if (!isset($input['class_id']) || !isset($input['subject_id']) || !isset($input['topic'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: class_id, subject_id, or topic.']);
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

$id = guidv4();
$currentDate = date('Y-m-d H:i:s');

try {
    // 3. Insert Database Record
    $sql = "INSERT INTO lesson_notes (
        id, teacher_id, class_id, subject_id, 
        academic_session, term, week, 
        topic, sub_topic, duration, period,
        previous_knowledge, instructional_materials,
        learning_objectives_cognitive, learning_objectives_affective, learning_objectives_psychomotor,
        set_induction, presentation, evaluation, summary, assignment,
        status, created_at
    ) VALUES (
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?
    )";

    // Default status is 'draft' unless 'pending' is requested specifically (e.g. submit immediately)
    $status = isset($input['status']) && $input['status'] === 'pending' ? 'pending' : 'draft';
    $submittedAt = ($status === 'pending') ? $currentDate : null;

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id, $teacherId, $input['class_id'], $input['subject_id'],
        $input['academic_session'] ?? '2024/2025', $input['term'] ?? 'First Term', $input['week'] ?? 1,
        $input['topic'], $input['sub_topic'] ?? null, $input['duration'] ?? null, $input['period'] ?? null,
        $input['previous_knowledge'] ?? null, $input['instructional_materials'] ?? null,
        $input['learning_objectives_cognitive'] ?? null, $input['learning_objectives_affective'] ?? null, $input['learning_objectives_psychomotor'] ?? null,
        $input['set_induction'] ?? null, $input['presentation'] ?? null, $input['evaluation'] ?? null, $input['summary'] ?? null, $input['assignment'] ?? null,
        $status, $currentDate
    ]);
    
    // If submitted immediately, update submitted_at
    if ($submittedAt) {
        $updateStmt = $pdo->prepare("UPDATE lesson_notes SET submitted_at = ? WHERE id = ?");
        $updateStmt->execute([$submittedAt, $id]);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Lesson note created successfully.',
        'data' => [
            'id' => $id,
            'status' => $status
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create lesson note: ' . $e->getMessage()]);
}
