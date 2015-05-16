<?php
	$dbConfig = parse_ini_file('./config.env.ini',true);
	if(!$dbConfig) {
		throw new Exception('Couldn\'t read convig.env.ini');	
	}
	$connection = mysql_connect($dbConfig['db']['host'], $dbConfig['db']['user'], $dbConfig['db']['password']);
	if(!$connection) {
		throw new Exception('Coudn\'t connect to database');
	}
	mysql_select_db($dbConfig['db']['name']);
?>