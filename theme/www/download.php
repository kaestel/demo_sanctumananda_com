<?php

// File download (From public files only)
$file_name = basename($_SERVER['REQUEST_URI']);

$file = $_SERVER["LOCAL_PATH"]."/www/img/desktop/showcase/".$file_name;
print($file);
if(file_exists($file)) {

	header('Content-Description: File download');
	header('Content-Type: application/octet-stream');
	header("Content-Type: application/force-download");
	header('Content-Disposition: attachment; filename=' . $file_name);
	header('Expires: 0');
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Pragma: public');
	header('Content-Length: ' . filesize($file));

	ob_clean();
	// enable downloading large file without memory issues
	ob_end_flush();
	//flush();
	readfile($file);
	exit();
}


?>