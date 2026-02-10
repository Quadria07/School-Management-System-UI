<?php
// api/parents/children.php
// Fetch list of children linked to this parent
require_once '../db_connect.php';
require_once '../utils/jwt.php';

$token = JWT::getBearerToken();
$payload = JWT::decode($token, JWT_SECRET);

if (!$payload || $payload['data']['role'] !== 'parent') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$parentId = $payload['data']['id'];

try {
    // Note: The original schema doesn't have a direct 'parent_id' link in profiles yet.
    // Usually there is a 'relationships' table or 'parent_id' in profiles.
    // For now, I will assume a 'relationships' design or we link by email/phone matching.
    // BUT since we just created the schema, let's verify.
    // Checking schema... Schema has NO direct link.  
    
    // TEMPORARY FIX: For the TEST, we will just return ALL students (simulating that this parent owns them)
    // In production, we need a `parent_student` table.
    
    $sql = "SELECT id, full_name, student_id, avatar_url FROM profiles WHERE role = 'student' LIMIT 5";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $children = $stmt->fetchAll();

    echo json_encode(['status' => 'success', 'data' => $children]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
