<?php  

$url_to_image = 'https://2.bp.blogspot.com/-p12NfQXVzsc/VvrR6nGzFdI/AAAAAAAAEZM/QSEXO-WnEr0sUleGaItemBnslJvy2Pjrg/s640/026816914_prevstill.jpg';
$my_save_dir = 'pics'; 
$filename = "/TEST.jpg";
$complete_save_loc = $my_save_dir . $filename; 
$data = file_get_contents($url_to_image);
if(empty($data)) {
	die("UNABLE TO READ IMAGE FILE!");
}
file_put_contents($complete_save_loc, $data) or die("UNABLE TO WRITE FILE!");

echo ($complete_save_loc);
?>
