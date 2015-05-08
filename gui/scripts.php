<?php

header('Content-type: application/javascript');

include('library/AssetsHelper.php');
$assets = new \Neura\Joint\AssetsHelper;
$scripts = $assets->listAllFiles(__DIR__,Array('js'));

$header = Array();
foreach($scripts as $s) {
	$header[] = file_get_contents($s);
	//$header[] = '<script type="text/javascript" src="'.$s.'"></script>';
}

echo implode(PHP_EOL,$header);