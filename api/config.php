<?php

/* konfiguracja
 * 0 => metoda http
 * 1 => ścieżka do zmatchowania
 * 2 => metoda modelu
 * 3 => customowa kolejność argumentów + przechwytywanie argumentów z requestu
 */


$config = Array(
	//Array('POST', '/test', 'getSearchList', Array('objectId', 'children')),

	Array('POST','/login','login', Array('username', 'password')),
	Array('POST', '/signup', 'signup', Array('username','name','password') ),
	Array('POST', '/friends/:frID/objects/:oID/friendship', 'addFriendship', Array ('oID', 'frID')), //potwierdza lub zaczyna przyjaźń
	Array('POST', '/call/checkin', 'callCheckIn', Array('easyRTCID')),
	
	Array('GET', '/session', 'checkSession'),
	Array('GET', '/info', 'getInfo'),
    Array('GET', '/types', 'getObjectsByField', Array('!PARENT_ID','!5')),
    Array('GET', '/templates', 'getObjectsByField', Array('!TYPE','!9')),     
	
	Array('GET', '/aliases', 'getAliases'),
	
	Array('GET', '/objects', 'structure'),
	Array('GET', '/objects/:objectId', 'getObjectsByField', Array('!ID','objectId')),
	Array('GET', '/objects/:ID/friends', 'getFriendList', Array('ID','!true')), //pobiera przyjaciol dla danego obiektu
	Array('GET', '/objects/:ID/friends-legacy', 'friendList', Array('ID')), //pobiera przyjaciol dla danego obiektu
	Array('GET', '/objects/:ID/search', 'getSearchList', Array('ID','!true')), //pobiera znalezione obiekty
	Array('GET', '/objects/:ID/contents', 'getContents', Array('ID')),
	
	Array('GET', '/friends/:frID/objects/:ID', 'structure', Array('ID')), /*pobiera obiekt przyjaciela*/
	
	//friend objects interaction
	Array('GET', '/objects/:ID/friends/:frID/chat',  'chat', Array('ID', 'frID')), //pobiera tresc chatu dla obiektu przyjaciela
	Array('POST', '/objects/:ID/friends/:frID/chat', 'chat', Array('ID', 'frID', 'message')), //dodaje wiadomość
	
	Array('GET', '/objects/:ID/search/:frID/chat',  'chat', Array('ID', 'frID')), //pobiera tresc chatu dla obiektu przyjaciela
	Array('POST', '/objects/:ID/search/:frID/chat', 'chat', Array('ID', 'frID', 'message')), //dodaje wiadomość
	
	Array('POST', '/objects/:ID/search/:frID/friendship',  'addFriendship', Array('ID', 'frID')), //dodaje / potwierdza przyjazn
	Array('DELETE', '/objects/:ID/friends/:frID/friendship',  'removeFriendship', Array('ID', 'frID')), //usuwa przyjazn
	
	Array('GET', '/friends/:frID/objects/:oID/call', 'call', Array ('oID', 'frID')), //makes EasyRTC connection
	Array('GET', '/friends/call', 'callInfo', Array ('easyRTCID')), 
	
	
	Array('DELETE', '/friends/:frID/objects/:oID/friendship', 'removeFriendship', Array('oID', 'frID')), 
	Array('DELETE', '/objects/:ID', 'removeObject', Array('ID')), //usuwa obiekt
	Array('DELETE', '/aliases/:ID', 'removeAlias', Array('ID', 'replaceId') ), //usuwa alias
	Array('DELETE', '/objects/:oID/contents/:cID', 'removeObject', Array('cID')), //usuwa content
	
	
	Array('POST',  '/aliases', 'addAlias', Array('alias')), //dodaje alias
	Array('POST', '/objects/:ID', 'addObject', Array('ID', '$POST')), //dodaje nowy obiekt jako childa
	Array('POST', '/objects/:ID/contents', 'addObject', Array('ID', '$POST')), //dodaje content dla obiektu
	Array('POST', '/objects/:ID/contents/:cntID', 'updateObject', Array('cntID','$POST')),
	
	Array('POST', '/friends/:frID/objects/:oID/chat', 'chat', Array('oID', 'frID', 'message')), //dodaje wiadomosc do tresci chatu dla obiektu przyjaciela
	
	Array('PUT', '/objects/:ID', 'updateObject', Array('ID','$POST')),
	Array('PUT', '/objects/:ID/contents/:cntID', 'updateObject', Array('cntID','$POST')),
	
	
	/*Array('GET','/example','foo'),
	Array('GET','/example/:some_id','bar'),
	Array('GET','/example/:some_id/method','baz'),
	Array('GET','/example/:second_arg/:first_arg','seq',Array('first_arg','second_arg','third_arg'))*/
);