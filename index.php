<?php
/**
 * SIDADUZ Root Entry Point
 * 
 * File ini memungkinkan akses dari http://localhost/sidaduz/
 * dengan meneruskan request ke public/index.php Laravel
 */

// Change to the public directory context
chdir(__DIR__ . '/public');

// Include the Laravel entry point
require __DIR__ . '/public/index.php';
