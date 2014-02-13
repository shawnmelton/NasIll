<?php
require_once 'config.php';

if(isset($_GET['action']) && $_GET['action'] !== '') {
    $api = new API();
    $api->request($_GET['action']);
}

header('HTTP/1.0 404 Not Found');