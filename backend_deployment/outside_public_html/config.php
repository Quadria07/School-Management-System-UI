<?php
// CONFIGURATION FILE
// UPLOAD LOCATION: /home/yourusername/config.php (Above public_html)

// Database Settings
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_cpanel_username_school_db'); // Update this
define('DB_USER', 'your_cpanel_username_db_user');   // Update this
define('DB_PASS', 'your_strong_password');           // Update this

// Security Keys
define('JWT_SECRET', 'change_this_to_a_random_string_of_characters');

// App Settings
define('APP_ENV', 'production');
define('DEBUG_MODE', true);
?>
