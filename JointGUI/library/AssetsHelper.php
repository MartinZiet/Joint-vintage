<?php

namespace Neura\Joint;

class AssetsHelper {
	
	public function listAllFiles($dir,$extensions=false)
	{
	    $items = glob($dir . '/*');
	
	    for ($i = 0; $i < count($items); $i++) {
	        if (is_dir($items[$i])) {
	            $add = glob($items[$i] . '/*');
	            $items = array_merge($items, $add);
	        }
	    }
		
		$list = Array();
		
		foreach($items as $file) {
			$ext = pathinfo($file,PATHINFO_EXTENSION);
			if(in_array($ext,$extensions)) {
				$relative = str_replace(realpath($dir).'/','',$file);
				$list[] = $relative;
			}
		}
	
	    return $list;
	
	}
	
}