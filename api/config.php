<?php

/* konfiguracja
 * 0 => metoda http
 * 1 => ścieżka do zmatchowania
 * 2 => metoda modelu
 * 3 => customowa kolejność argumentów + przechwytywanie argumentów z requestu
 */


$config = Array(
	Array('POST','/login','login', Array('username', 'password')),
	Array('POST', '/signup', 'signup', Array('username','name','password') ),
	
	Array('GET', '/aliases', 'getAliases'),
	Array('GET', '/structure', 'structure'),
	Array('GET', '/structure/objects/:ID/friends', 'friendList', Array('ID')), //pobiera przyjaciol dla danego obiektu
	Array('GET', '/friends/objects/:ID', 'structure', Array('ID')), /*pobiera obiekt przyjaciela*/
	
	/*Array('GET','/example','foo'),
	Array('GET','/example/:some_id','bar'),
	Array('GET','/example/:some_id/method','baz'),
	Array('GET','/example/:second_arg/:first_arg','seq',Array('first_arg','second_arg','third_arg'))*/
);