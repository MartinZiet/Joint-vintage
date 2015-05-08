<!doctype html>
<html ng-app="joint">
	<head>
		<?php include('includes/header.vendor.php'); ?>
		<script type="text/javascript" src="scripts.php"></script>
		<link rel="stylesheet" href="styles.php" />
		<style>
		    /** we need to make sure that the basic geometry is applied before angular executes **/
		    [map-view] { overflow:hidden; width:100%; height:100vh; }
		</style>
	</head>
	
	<body>
		
		<div ui-view>    		
        </div>
        
        <div sidepanel>
        </div>
		
	</body>
</html>