<?php
require_once 'ss/config.php';

// Brae's face
$zoom = 1;
$cropX = 48;
$cropY = -84;

// My face big
$zoom = 2;
$cropX = 265;
$cropY = -121;

$text = 'Shawn';

$img = new Image('/Users/shawn.melton/Projects/NasIll/dist/ss/uploads/03/12/12/1394641552-5712.jpg');

$img->resize($zoom);
$img->crop($cropX, $cropY);
$img->cropFace();
$img->overlayOnAlbum();
$img->overlayTopLayer();
$img->overlayText(strtolower($text), array(0, 0, 0));
$img->overlayText(strtolower($text), array(159, 56, 29));

$img->output();

