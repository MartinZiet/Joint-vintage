<?php
	
	
	function distance ($f, $t) {
		$e = 6378137;
		$i = M_PI/180;
		$n = ($t[0]-$f[0])*$i;
		$s = ($t[1]-$f[1])*$i;
		$a = $f[0]*$i;
		$r = $t[0]*$i;
		$h = sin($n/2);
		$l = sin($s/2);
		$u = $h*$h+$l*$l*cos($a)*cos($r);
		return 2*$e*atan2(sqrt($u), sqrt(1-$u));
	}
	
	
?>