<?php
require_once 'ss/config.php';

// Zoom = 2
// Crop X = 265
// Crop Y = -119
// Demo = 308 x 308
// Actual = 500 x 489

// My face
$zoom = 1;
$cropX = 48;
$cropY = -84;

/*$zoom *= 1.35;
$cropX *= 1.12;
$cropY *= .55;*/

$diffX = 500 - 308;
$diffY = 489 - 308;

//$cropX -= $diffX;
//$cropY -= $diffY;

$overlayPng = imagecreatefrompng('/Users/shawn.melton/Projects/NasIll/dist//img/artOverlayLayer.png');
$img = new Image('/Users/shawn.melton/Projects/NasIll/dist/ss/uploads/03/12/12/1394641552-5712.jpg');
//$img = new Image('/Users/shawn.melton/Projects/NasIll/dist/img/photo-edit-face-outline.png');

//$img->resize($zoom);
$img->crop($cropX, $cropY);
$img->cropFace();
//$img->overlayImage($overlayPng);

//$img->cropFace();
$img->output();

