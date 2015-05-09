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
	Array('POST', '/friends/:frID/objects/:oID/friendship', 'addFriendship', Array ('oID', 'frID')), //potwierdza lub zaczyna przyjaźń
	
	Array('GET', '/aliases', 'getAliases'),
	Array('GET', '/structure', 'structure'),
	Array('GET', '/structure/objects/:ID/friends', 'friendList', Array('ID')), //pobiera przyjaciol dla danego obiektu
	Array('GET', '/friends/objects/:ID', 'structure', Array('ID')), /*pobiera obiekt przyjaciela*/
	Array('GET', '/friends/:frID/objects/:oID/chat',  'chat', Array('oID', 'frID')), //pobiera tresc chatu dla obiektu przyjaciela
	
	
	Array('DELETE', '/friends/:frID/objects/:oID/friendship', 'removeFriendship', Array('frID', 'oID')), 
	Array('DELETE', '/structure/objects/:ID', 'removeObject', Array('ID')), //usuwa obiekt
	Array('DELETE', '/aliases/:ID/:altID', 'removeAlias', Array('ID', 'altID') ), //usuwa alias
	Array('DELETE', '/structure/objects/:oID/contents/:cID', 'removeObject', Array('cID')), //usuwa content
	
	
	Array('PUT',  '/aliases', 'addAlias', Array('name')), //dodaje alias
	Array('PUT', '/structure/objects/:ID', 'addObject', Array('ID', 'name', 'public', 'type', 'tags')), //dodaje nowy obiekt jako childa
	Array('PUT', '/structure/objects/:ID/contents', 'addContent', Array('ID', 'name', 'HTML')), //dodaje content dla obiektu
	Array('PUT', '/friends/:frID/objects/:oID/chat', 'chat', Array('oID', 'frID', 'message')), //dodaje wiadomosc do tresci chatu dla obiektu przyjaciela
	
	
	
	/*Array('GET','/example','foo'),
	Array('GET','/example/:some_id','bar'),
	Array('GET','/example/:some_id/method','baz'),
	Array('GET','/example/:second_arg/:first_arg','seq',Array('first_arg','second_arg','third_arg'))*/
);