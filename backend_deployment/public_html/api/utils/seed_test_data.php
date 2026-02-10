<?php
// api/utils/seed_test_data.php
require_once '../db_connect.php';

echo "<h1>Seeding Test Data...</h1>";

try {
    // 1. Create Test Class
    $classId = 'demo-class-id';
    $className = 'JSS 1A';
    
    $stmt = $pdo->prepare("SELECT id FROM classes WHERE id = ?");
    $stmt->execute([$classId]);
    if (!$stmt->fetch()) {
        $stmt = $pdo->prepare("INSERT INTO classes (id, name, level) VALUES (?, ?, ?)");
        $stmt->execute([$classId, $className, 'JSS 1']);
        echo "<p>✅ Created Class: $className ($classId)</p>";
    } else {
        echo "<p>ℹ️ Class already exists.</p>";
    }

    // 2. Create Test Subject
    $subjectId = 'demo-subject-id';
    $subjectName = 'Biology';
    
    $stmt = $pdo->prepare("SELECT id FROM subjects WHERE id = ?");
    $stmt->execute([$subjectId]);
    if (!$stmt->fetch()) {
        $stmt = $pdo->prepare("INSERT INTO subjects (id, name, code, level) VALUES (?, ?, ?, ?)");
        $stmt->execute([$subjectId, $subjectName, 'BIO101', 'JSS 1']);
        echo "<p>✅ Created Subject: $subjectName ($subjectId)</p>";
    } else {
        echo "<p>ℹ️ Subject already exists.</p>";
    }

    echo "<h3>Done! You can now create lesson notes.</h3>";

} catch (Exception $e) {
    echo "<h2>❌ Error: " . $e->getMessage() . "</h2>";
}
?>
