<?php

$path = $_SERVER['PATH_INFO'];
$path = explode('/',$path);
array_shift($path);

$n = $path[0];
$id = $path[1];
$sub = $path[2];

if(!$n) { $n = 'structure'; }

$headers = getallheaders(); 
$method = $headers['X-Http-Method-Override'];

header('x-request-method: '.$method);

$structure = Array(
	Array('id'=>1,'parent_id'=>0,'name'=>'Joint Origin','alias'=>'Some alias','is_public'=>true,'type'=>0),
	Array('id'=>2,'parent_id'=>1,'name'=>'Another object1','alias'=>'Another alias','is_public'=>true,'type'=>15),
    Array('id'=>3,'parent_id'=>1,'name'=>'Another object2','alias'=>'Another alias','is_public'=>true,'type'=>15),
    Array('id'=>4,'parent_id'=>1,'name'=>'Another object3','alias'=>'Another alias','is_public'=>true,'type'=>15),
    Array('id'=>5,'parent_id'=>1,'name'=>'Another object4','alias'=>'Another alias','is_public'=>false,'type'=>15),
    Array('id'=>6,'parent_id'=>5,'name'=>'Another object5','alias'=>'Another alias','is_public'=>true,'type'=>15),
    Array('id'=>7,'parent_id'=>5,'name'=>'Another object6','alias'=>'Another alias','is_public'=>true,'type'=>15),
    Array('id'=>8,'parent_id'=>5,'name'=>'Another object7','alias'=>'Another alias','is_public'=>true,'type'=>15),
    Array('id'=>9,'parent_id'=>5,'name'=>'Another object8','alias'=>'Another alias','is_public'=>true,'type'=>15),
    Array('id'=>10,'parent_id'=>7,'name'=>'Object6 Child','alias'=>'Another alias','is_public'=>true,'type'=>17,
    'tags'=>Array(
    	Array('id'=>1,'name'=>'_template_id','points'=>Array(
    		Array('value'=>19)
		))
	)),        
    Array('id'=>13,'parent_id'=>1,'name'=>'Core types','alias'=>'Joint','is_public'=>true,'type'=>0),
    //Array('id'=>14,'parent_id'=>13,'name'=>'User','is_public'=>true,'type'=>13),
    Array('id'=>15,'parent_id'=>13,'name'=>'Object','is_public'=>true,'type'=>13),
    Array('id'=>16,'parent_id'=>13,'name'=>'Content','is_public'=>true,'type'=>13),
    Array('id'=>17,'parent_id'=>13,'name'=>'Search','is_public'=>true,'type'=>13),
    Array('id'=>18,'parent_id'=>13,'name'=>'Template','is_public'=>true,'type'=>13)
);

$structure[] = Array(
    'id'=>19,'parent_id'=>18,'name'=>'Buy/sell a car','verbs'=>Array(),
    'tags'=>Array(
        Array('id'=> 1, 'name'=> 'Make', 'type'=>1, 'multiple'=>true, 'extensible'=>true, 
        'points'=>Array(Array('value'=>'Mazda'),Array('value'=>'Volvo'),Array('value'=>'Volkswagen'))
        ),
        Array( 'id'=> 2, 'name'=>'Model', 'type'=>1, 'extensible'=>true, 'points'=> Array() ),
        Array( 'id'=> 3, 'name'=>'Engine capacity', 'type'=>2, 'points'=> Array() ),
        Array( 'id'=> 4, 'name'=>'Location', 'type'=>3, 'points'=> Array() ),
        Array( 'id'=> 5, 'name'=>'Price', 'type'=>2, 'reverse'=>true, 'points'=> Array(Array('from'=>0,'to'=>200000) ))        
    ),
    'verbs'=>Array(Array('name'=>'Sell','mode'=>'offer'),Array('name'=>'Buy','mode'=>'want')),
    'type'=>18
);

$structure[] = Array('id'=>20,'parent_id'=>18,'name'=>'Partner for sport',
    'type'=>18,'verbs'=>Array(Array('name'=>'Find','mode'=>'exchange')),
    'tags'=>Array()
);
$structure[] = Array('id'=>21,'parent_id'=>18,'name'=>'Carpooling',
    'type'=>18,'verbs'=>Array(Array('name'=>'Find','mode'=>'exchange')),
    'tags'=>Array()
);

$friends = Array(
    Array('id'=>1,'name'=>'Włodek','objects'=>Array(Array('id'=>11,'name'=>'Obiekt Włodka','edit_locked'=>true,'type'=>15))),
    Array('id'=>2,'name'=>'Kazik','objects'=>Array(Array('id'=>12,'name'=>'Obiekt Kazika','edit_locked'=>true,'type'=>15))),
    Array('id'=>3,'name'=>'Tetsuo','objects'=>Array(Array('id'=>13,'name'=>'Obiekt Tetsuo','edit_locked'=>true,'type'=>15),Array('id'=>14,'name'=>'Drugi obiekt Tetsuo','edit_locked'=>true,'type'=>15)))
);

$contents = Array(
	Array('id'=>1,'name'=>'Some object content1','content'=>'<b>Some html</b> content'),
	Array('id'=>2,'name'=>'Some object content2','content'=>'<b>Some html</b> content'),
	Array('id'=>3,'name'=>'Some object content3','content'=>'<b>Some html</b> content')
);

$result = $$n;

if($n=='objects' && $id) {
    $result = Array();
    foreach($structure as $s) {
        if($s['id']==$id) { $result = $s; }
    }
}

if($n=='friends' && $id && $sub=='objects') {
    foreach($friends as $f) {
        if($f['id']==$id) {
            $result = $f['objects'];
        }
    }
}

function byKey($structure,$key,$id) {
    $result = Array();
    foreach($structure as $s) {
        if($s[$key]==$id) {
            $result[] = Array('id'=>$s['id'],'name'=>$s['name']);
        }
    }
    return $result;
}

if($n=='templates') { $result = byKey($structure,'type',18); }
if($n=='types') { $result = byKey($structure,'parent_id',13); }

if($n=='objects' && $sub=='contents') {
	$result = $contents;
}

header('Content-Type: application/json');
if($n!='gumtreee') {
	echo json_encode($result);
} else {
	echo $result;
}
die();