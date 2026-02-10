<?php
// api/db_connect.php

// 1. CORS Headers (Allow frontend to connect) - MOVED TO TOP
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. Load configuration from OUTSIDE public_html
// We look 2 levels up: api -> public_html -> home
$configPath = __DIR__ . '/../../config.php';

if (!file_exists($configPath)) {
    http_response_code(500);
    die(json_encode(['error' => 'Configuration file config.php not found in home directory.']));
}

require_once $configPath;

// 3. Database Connection
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    
} catch (\PDOException $e) {
    if (defined('DEBUG_MODE') && DEBUG_MODE) {
        error_log("Connection error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed.']);
    }
    exit;
}
?>
