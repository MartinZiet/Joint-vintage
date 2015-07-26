<?php

$exclude = Array('.','..');

$path = 'chrome-extension';
$files = scandir($path);

$manifest = file_get_contents($path.'/manifest.json');
$manifest = json_decode($manifest,true);

$version = $manifest['version'];

$zipname = 'joint-extension-'.$version.'.zip';
$zip = new ZipArchive;
$zip->open($zipname, ZipArchive::CREATE);

foreach ($files as $file) {
  if(!in_array($file,$exclude)) {
    $zip->addFile($path.'/'.$file);
  }
}
$zip->close();

header('Content-Type: application/zip');
header('Content-disposition: attachment; filename='.$zipname);
header('Content-Length: ' . filesize($zipname));
readfile($zipname);