<?php
// api/test_db.php
require_once 'db_connect.php';

// If require_once passes, the connection is successful
echo json_encode([
    'status' => 'success',
    'message' => 'Connected to MySQL Database successfully!',
    'database_name' => DB_NAME,
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
