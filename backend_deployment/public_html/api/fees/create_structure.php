<?php
// api/fees/create_structure.php
// Admin creates a fee structure for a Term/Level (e.g. JSS 1, First Term, 50,000)
require_once '../db_connect.php';
require_once '../utils/jwt.php';

$token = JWT::getBearerToken();
$payload = JWT::decode($token, JWT_SECRET);

if (!$payload || !in_array($payload['data']['role'], ['admin', 'principal', 'proprietor', 'bursar'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['level']) || !isset($input['term']) || !isset($input['total_fee'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// UUID
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
    $id = guidv4();
    $session = $input['academic_session'] ?? '2024/2025';
    
    // Check if exists
    $stmt = $pdo->prepare("SELECT id FROM fee_structures WHERE level = ? AND term = ? AND academic_session = ?");
    $stmt->execute([$input['level'], $input['term'], $session]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Fee structure already exists for this level/term']);
        exit;
    }

    $sql = "INSERT INTO fee_structures (id, level, term, academic_session, tuition_fee, total_fee) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id, $input['level'], $input['term'], $session, 
        $input['total_fee'], $input['total_fee']
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Fee structure created', 'data' => ['id' => $id]]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
