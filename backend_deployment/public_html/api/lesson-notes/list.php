<?php
// api/lesson-notes/list.php
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
    $sql = "";
    $params = [];

    // Filter Logic based on Role
    if ($role === 'teacher') {
        // Teachers see their own notes
        $sql = "SELECT ln.id, ln.topic, ln.week, ln.status, ln.created_at, ln.submitted_at, 
                       c.name as class_name, s.name as subject_name
                FROM lesson_notes ln
                LEFT JOIN classes c ON ln.class_id = c.id
                LEFT JOIN subjects s ON ln.subject_id = s.id
                WHERE ln.teacher_id = ?
                ORDER BY ln.week DESC, ln.created_at DESC";
        $params[] = $userId;
    } elseif (in_array($role, ['principal', 'proprietor', 'admin'])) {
        // Admin sees strictly 'pending' notes for approval, or all if filtered
        $statusFilter = isset($_GET['status']) ? $_GET['status'] : 'pending';
        
        $sql = "SELECT ln.id, ln.topic, ln.week, ln.status, ln.submitted_at,
                       c.name as class_name, s.name as subject_name, profiles.full_name as teacher_name
                FROM lesson_notes ln
                LEFT JOIN classes c ON ln.class_id = c.id
                LEFT JOIN subjects s ON ln.subject_id = s.id
                LEFT JOIN profiles ON ln.teacher_id = profiles.id
                WHERE ln.status = ?
                ORDER BY ln.submitted_at ASC";
        $params[] = $statusFilter;
    } else {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        exit;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $notes = $stmt->fetchAll();

    echo json_encode(['status' => 'success', 'data' => $notes]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
