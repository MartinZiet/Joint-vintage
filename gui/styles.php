<?php

$file = 'assets/less/style.less';

header('Content-type: text/css');

include "library/less.inc.php";
$parser = new lessc;
echo $parser->compileFile($file);