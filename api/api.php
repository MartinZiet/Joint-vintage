
<?php
	session_start ();

	require_once ('lib/database.php');
	require_once ('lib/objectMatch.php');
	require_once ('lib/jointModel.php');
	require_once ('lib/functions.php');
	
	require_once ('jointRouter.php');
	require_once ('config.php');

	
	$jointRouter = new jointRouter($config);
	$jointRouter -> processRequest(new jointModel);

?>
