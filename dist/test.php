<?php
require_once 'ss/config.php';

// Zoom = 2
// Crop X = 265
// Crop Y = -119
// Demo = 308 x 308
// Actual = 500 x 489

// Brae's face
$zoom = 1;
$cropX = 48;
$cropY = -84;

// My face big
$zoom = 2;
$cropX = 265;
$cropY = -121;

//$cropX = 100;
//$cropY = 0;

$text = 'Todd';


$img = new Image('/Users/shawn.melton/Projects/NasIll/dist/ss/uploads/03/12/12/1394641552-5712.jpg');

$img->resize($zoom);
$img->crop($cropX, $cropY);
$img->cropFace();
$img->overlayOnAlbum();
$img->overlayTopLayer();
$img->overlayText(strtolower($text), 136, array(0, 0, 0), 116);
$img->overlayText(strtolower($text), 135, array(159, 56, 29), 115);

$img->output();

