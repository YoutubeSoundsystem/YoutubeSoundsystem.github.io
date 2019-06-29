<?php

header('Content-Type: application/json');

$url_to_image = $_GET["url"];
$fileNum = $_GET["num"];


$data = file_get_contents($url_to_image);
$image = imagecreatefromstring($data);
if (!$image) {
	echo "Image type not supported!\n";
}
$scaled = imagescale($image, 1, 1, IMG_BICUBIC); 
$index = imagecolorat($scaled, 0, 0);
$rgb = imagecolorsforindex($scaled, $index); 
echo json_encode($rgb);

// for hex values
//$red = round(round(($rgb['red'] / 0x33)) * 0x33); 
//$green = round(round(($rgb['green'] / 0x33)) * 0x33); 
//$blue = round(round(($rgb['blue'] / 0x33)) * 0x33); 
//echo sprintf('#%02X%02X%02X', $red, $green, $blue); 

// $my_save_dir = 'pics'; 
// $filename = "/TEST" . $fileNum . ".jpg";
// $complete_save_loc = $my_save_dir . $filename; 
// $data = file_get_contents($url_to_image);
// if(empty($data)) {
// 	die("UNABLE TO READ IMAGE FILE!");
// }
// $handle = file_put_contents($complete_save_loc, $data, LOCK_EX) or die("UNABLE TO WRITE FILE!");

// while(is_resource($handle)){
//    //Handle still open
// }

// sleep(15);

// echo ($complete_save_loc);
?>
