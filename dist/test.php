<?php
require_once 'ss/config.php';

$out = CheckdIn::createUser('John', 'Doe', 'john.doe@test.com');
var_dump($out);
exit;

// Brae's face
$zoom = 1;
$cropX = 48;
$cropY = -84;

// My face big
$zoom = 2;
$cropX = 265;
$cropY = -121;

// Tori and Shawn pic
$zoom = 1.9;
$cropX = 49;
$cropY = 158;
$angle = 30;

$zoom = 0.9;
$cropX = -32;
$cropY = -31;
$angle = -120;

$text = 'Tori';

if($angle % 90 != 0) {
    $zoom *= .8;
}

//$img = new Image('/Users/shawn.melton/Projects/NasIll/dist/ss/uploads/03/12/12/1394641552-5712.jpg');
$img = new Image('/Users/shawn.melton/Pictures/shawn-and-tori.jpg');
//$img = new Image('/Users/shawn.melton/Pictures/shawn-small.jpg');
$img->resize($zoom);
$img->rotate($angle);
$img->crop($cropX, $cropY);
$img->cropFace2();

$img->overlayOnAlbum();
$img->overlayOrangeHue();
$img->overlayTopLayer();
$img->overlayText(strtolower($text), array(159, 56, 29));

$img->output();

$albums = new AlbumCovers();
print_r($albums->getArt(0, 20));

$user = CurrentUser::get();
var_dump($user->find());

