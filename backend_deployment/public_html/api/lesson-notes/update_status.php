<?php
// api/lesson-notes/update_status.php
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

$role = $payload['data']['role'];
$userId = $payload['data']['id'];

// 2. Get Input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id']) || !isset($input['status'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: id, status']);
    exit;
}

$noteId = $input['id'];
$newStatus = $input['status'];
$validStatuses = ['draft', 'pending', 'approved', 'rejected', 'published'];

if (!in_array($newStatus, $validStatuses)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid status']);
    exit;
}

try {
    // 3. Authorization Checks
    // Fetch the note first to check ownership
    $stmt = $pdo->prepare("SELECT teacher_id FROM lesson_notes WHERE id = ?");
    $stmt->execute([$noteId]);
    $note = $stmt->fetch();

    if (!$note) {
        http_response_code(404);
        echo json_encode(['error' => 'Lesson note not found']);
        exit;
    }

    $isOwner = ($note['teacher_id'] === $userId);
    $isAdmin = in_array($role, ['principal', 'proprietor', 'admin']);

    if ($role === 'teacher') {
        if (!$isOwner) {
            http_response_code(403);
            echo json_encode(['error' => 'You can only modify your own notes.']);
            exit;
        }
        // Teachers can only move to 'pending' (submit) or back to 'draft' (unsubmit)
        if (!in_array($newStatus, ['pending', 'draft'])) {
            http_response_code(403);
            echo json_encode(['error' => 'Teachers can only submit (pending) or save as draft.']);
            exit;
        }
    } elseif ($isAdmin) {
        // Admins can strictly do approval/rejection
        // They should probably not be setting things to 'draft' or 'pending' but let's allow flexibility 
        // usually they do 'approved' or 'rejected'.
    } else {
        http_response_code(403);
        echo json_encode(['error' => 'Permission denied']);
        exit;
    }

    // 4. Update Database
    $sql = "UPDATE lesson_notes SET status = ?";
    $params = [$newStatus];

    // Timestamp updates
    if ($newStatus === 'pending') {
        $sql .= ", submitted_at = NOW()";
    } elseif ($newStatus === 'approved') {
        $sql .= ", approved_at = NOW(), approved_by = ?";
        $params[] = $userId;
    } elseif ($newStatus === 'rejected') {
        $sql .= ", approved_by = ?"; // Tracking who rejected it too
        $params[] = $userId;
    }

    $sql .= " WHERE id = ?";
    $params[] = $noteId;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['status' => 'success', 'message' => "Lesson note status updated to '$newStatus'."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
