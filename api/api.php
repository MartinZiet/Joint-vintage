<?php

	ini_set('display_errors','on');
	error_reporting(E_ERROR | E_PARSE);

	session_start ();

	require_once ('lib/database.php');
	require_once ('lib/objectMatch.php');
	require_once ('lib/jointModel.php');
	require_once ('lib/functions.php');
	
	require_once ('jointRouter.php');
	require_once ('config.php');
	
	/* no-Apache servers */
	if (!function_exists('getallheaders')) { 
		function getallheaders() { 
			$headers = ''; 
			foreach ($_SERVER as $name => $value) { 
				if (substr($name, 0, 5) == 'HTTP_') { 
					   $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value; 
				} 
			} 
			return $headers; 
		} 
	} 

	
	$jointRouter = new jointRouter($config);
	$jointRouter -> processRequest(new jointModel);

?>
