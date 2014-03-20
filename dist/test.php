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

// Tori and Shawn pic
$zoom = 2;
$cropX = -76;
$cropY = -31;

$text = 'Tori';

//$img = new Image('/Users/shawn.melton/Projects/NasIll/dist/ss/uploads/03/12/12/1394641552-5712.jpg');
$img = new Image('/Users/shawn.melton/Pictures/shawn-and-tori.jpg');
//$img = new Image('/Users/shawn.melton/Pictures/shawn-small.jpg');
$img->resize($zoom);
$img->crop($cropX, $cropY);
//$img->cropFace2();
//$img->overlayOnAlbum();
//$img->overlayTopLayer();
//$img->overlayText(strtolower($text), array(159, 56, 29));

$img->output();

