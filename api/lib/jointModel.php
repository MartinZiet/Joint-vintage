<?php
	class jointModel extends database {
		function __construct () {
			parent::init ();
		}
		
		function login ($username, $password) {
			$res = parent::getRecords('USERS', 'OBJECT_ID', 'LOGIN=\''.$username.'\' AND PASSWORD=\''.$password.'\'');
			if ($res['err'] > 0) return $res;
			
			//bledna autoryzacja
			if (isset($res['records'][0]) == false ) {
				return Array ('err'=>1, 'errMsg'=>"Incorrect username or password");
			}
			else {
				$_SESSION['ID'] = $res['records'][0]['OBJECT_ID'];
				return $res['records'][0];
			}
			
		}
		
		public function signup ($login, $name, $password) {
			//tworzymy usera
			$record = Array ('LOGIN'=>$login, 'NAME'=>$name, 'PASSWORD'=>$password, 'OBJECT_ID'=>1);
			$res = parent::addRecord('USERS', $record);
			if ($res['err'] > 0) return $res;
			
			//tworzymy obiekt
			$record = Array ('NAME'=>$name, 'PUBLIC'=>0, 'TYPE'=>0, 'TAGS'=>'{}', 'PARENT_ID'=>1, 'ALIAS_ID'=>1);
			$temp = (parent::addRecord('OBJECTS', $record));
			if ($temp['err'] > 0) return $temp;
			$res['objectId'] = parent::insertId();
			
			//tworzymy alias
			$record = Array ('OBJECT_ID'=>$res['objectId'], 'ALIAS'=>$name);
			$temp = (parent::addRecord('ALIASES', $record));
			if ($temp['err'] > 0) return $temp;
			$res['aliasId'] = parent::insertId();
			
			//aktualizujemy
			$update = Array ('PARENT_ID'=>'ID', 'ALIAS_ID'=>$res['aliasId']);
			$temp = (parent::updateRecords('OBJECTS', $update, 'ID='.$res['objectId']));
			if ($temp['err'] > 0) return $temp;
			
			$update = Array ('OBJECT_ID'=>$res['objectId']);
			$temp = (parent::updateRecords('USERS', $update, 'LOGIN=\''.$login.'\''));
			if ($temp['err'] > 0) return $temp;
			
			//jeœli wszystko sie udalo, autoryzujemy sesji
			$_SESSION['ID'] = $res['objectId'];
			return $res;
									
		}
		
		/*jako $objectId przy tej funkcji podajemy zawsze id G£ÓWNEGO obiektu danego uzytkownika, poniewaz aliasy sa globalne*/
		public function addAlias ($aliasName) {
			if (isset($_SESSION['ID'])) $objectId = $_SESSION['ID'];
			else return Array('err'=>1, 'errMsg'=>'Unlogged');
			
			$record = Array ('OBJECT_ID'=>$objectId, 'ALIAS'=>$aliasName);
			$res = parent::addRecord ('ALIASES', $record);
			if ($res['err'] == 0) $res['id'] = parent::insertId();
			return $res;
		}
		
		public function removeAlias ($aliasId, $altAliasId) {
			$update = Array ('ALIAS_ID'=>$altAliasId);
			$res =  parent::updateRecords('OBJECTS', $update, 'ALIAS_ID='.$aliasId);
			if ($res['err']>0) return $res;
			
			$temp = (parent::removeRecords ('ALIASES', 'ID='.$aliasId));
			$res['err']=$temp['err'];
			return $res;
		}
		
		public function changeAlias ($objectId, $newAliasId, $children=false) {
			$record = Array ('ALIAS_ID'=>$newAliasId);
			$res = parent::updateRecords ('OBJECTS', $record, 'ID='.$objectId);
			if ($res['err']>0) return $res;
			
			if ($children !== false) {
				$res = parent::getRecords('OBJECTS', 'ID', 'PARENT_ID='.$objectId.' AND ID!=PARENT_ID');
				if ($res['err'] > 0) return $res;
				foreach ($res['records'] as $i=>$row) {
					//var_dump($row);
					$res2 = $this->changeAlias ($row['ID'], $newAliasId, true);
					if ($res2['err']>0) return $res2;
				}
				unset($res['records']);
			}
			
			return $res;
		}
	
		public function getAliases ($objectId = -1) {
			if (($objectId == -1) && isset($_SESSION['ID'])) $objectId = $_SESSION['ID'];
			$res =  database::getRecords ('ALIASES', 'ID, ALIAS', 'OBJECT_ID='.$objectId, 'ORDER BY ID ASC');
			
			return $res;
		}
				
		public function addObject ($parentId, $name, $public, $type, $tags, $aliasId=0) {
			$record = Array ('PARENT_ID'=>$parentId, 'NAME'=>$name, 'PUBLIC'=>$public, 'TYPE'=>$type, 'TAGS'=>$tags, 'ALIAS_ID'=>$aliasId);
			
			$res = parent::addRecord ('OBJECTS', $record);
			if ($res['err'] === 0) $res['id'] = parent::insertId();
			
			return $res;
		}
		
		public function removeObject ($objectId) {
			//usuwamy dzieci
			$res = parent::getRecords ('OBJECTS', 'ID', 'PARENT_ID='.$objectId.' AND ID!='.$objectId);
			if ($res['err'] > 0) return $res;
			foreach ($res['records'] as $i => $row) {
				$res2 = $this->removeObject($row['ID']);
				if ($res2['err'] > 0) return $res2;
			}
			return parent::removeRecords('OBJECTS', 'ID='.$objectId);
		}
		
		public function moveObject ($objectId, $newParentId) {
			$update = Array ('PARENT_ID' => $newParentId);
			return parent::updateRecords ('OBJECTS', $update, 'ID='.$objectId);
		}
		
		public function structure ($objectId = -1, $owner = true) {
			if (($objectId == -1) && isset($_SESSION['ID'])) $objectId = $_SESSION['ID'];
			else $owner = false;
			
			$res = parent::getRecords ('OBJECTS', '*', 'ID='.$objectId);
			if ($res['err'] > 0) return $res;
				
			$n = 1;			
			for ($i=0;$i<$n;++$i) {
				//pobieramy dzieciaki dla naszego rekordu
				$res2 = parent::getRecords('OBJECTS', '*', 'PARENT_ID='.$res['records'][$i]['ID'].' AND ID!='.$res['records'][$i]['ID'].($owner===true ? '' : ' AND PUBLIC=1 AND TYPE=0'), 'ORDER BY ID');
				if ($res2['err'] > 0) return $res2;
				
				foreach ($res2['records'] as $j=>$row) {
					$res['records'][$n] = $row;
					++$n;
				}
			}
			return $res;
		}
	
		public function removeFriendship ($objectId1, $objectId2) {
			return parent::removeRecords ('FRIENDS', 'ABS(ID1)='.min($objectId1, $objectId2).' AND ABS(ID2)='.max($objectId1, $objectId2));
		}
		
		public function addFriendship ($objectId1, $objectId2) {
			/* wywo³anie tej funkcji oznacza, ¿e obiekt1 jest zainteresowany przyjaŸni¹ z obiektem2. 
			Jeœli obiekt 2 wczeœniej by³ zsainteresowany przyjaŸni¹, to nastêpuje wy³¹cznie modyfikacja rekordu w bazie danych
			w przeciwnym razie - treba doda rekord.
			Parametry przekazane do funkcji powinny byæ dodatnie, choæ w bazie danych liczby mog¹ by ujemne			*/
			
			$record = parent::getRecords('FRIENDS', 'ID1, ID2', 'ABS (ID1)='.min($objectId1, $objectId2).' AND ABS(ID2)='.max($objectId1, $objectId2));
			if ($record['err'] > 0) { return $record;}
			else $record = $record['records'][0];
			
			
			
			//jeœli cos ju¿ by³o
			if (isset($record['ID1'])) {
				if (($record['ID1'] == -$objectId1) || ($record['ID2'] == -$objectId1) ) {
					$update = Array ('ID1'=>'ABS(ID1)','ID2'=>'ABS(ID2)');
					$temp = parent::updateRecords('FRIENDS', $update, 'ID1='.$record['ID1'].' AND ID2='.$record['ID2']);
					if ($temp['err'] > 0) return $temp;
					else {
						$record['ID1'] = abs($record['ID1']);
						$record['ID2'] = abs($record['ID2']);	
						return $record;
					}
				}
				else return $record;
			}
			else {
				$record = ($objectId1 < $objectId2) ? Array ('ID1' => $objectId1, 'ID2' => -$objectId2) : Array ('ID1' => -$objectId2, 'ID2' => $objectId1);
				$temp = parent::addRecord ('FRIENDS', $record);
				if ($temp['err'] > 0) return $temp;
				else return $record;				
			}
		}
	
		public function friendList ($objectId) {
			$object=parent::getRecords('OBJECTS', '*', 'ID='.$objectId);
			if ($object['err'] > 0) return $object;
			else $object = $object['records'][0];
			
			$id = $object['ID'];
			$type = $object['TYPE'];
			
			if ($type == 1) {
				$parentId = $object['PARENT_ID'];
				
				$parentFriendList = parent::getRecords('FRIENDS', 'ID1+ID2-'.$parentId.' AS ID', 'ID1>0 AND ID2>0 AND (ID1='.$parentId.' OR ID2='.$parentId.')');
				if ($parentFriendList['err'] > 0 ) return $parentFriendList;
				
				$parentFriendString = '(-1,';
				foreach ($parentFriendList['records'] as $row) {
					$parentFriendString .= $row['ID'].',';
				}
				$parentFriendString = substr ($parentFriendString, 0, -1).')';
				
				$temp = parent::getRecords ('`OBJECTS` LEFT JOIN `ALIASES` ON OBJECTS.ALIAS_ID=ALIASES.ID',
				'OBJECTS.ID AS ID, OBJECTS.PARENT_ID AS PARENT_ID, OBJECTS.NAME AS NAME, OBJECTS.TAGS AS TAGS, OBJECTS.ALIAS_ID AS ALIAS_ID, ALIASES.ALIAS AS ALIAS_NAME',
				'OBJECTS.ID !='.$id.' AND OBJECTS.TYPE=1 AND NOT (OBJECTS.PARENT_ID IN '.$parentFriendString.')', 
				'ORDER BY OBJECTS.ID');
				if ($temp['err'] > 0) return $temp;
				$res = Array (); $n = 0;
				foreach ($temp['records'] as $row) {
					if (objectMatch::match($row, $object)) { 
						$res[$n] = $row;
						++$n;
					}
				}
				return Array ('err'=>0, 'friendList'=>$res);
			}
			else {
				$friends = parent::getRecords ('FRIENDS', '*', 'ID1>0 AND ID2>0 AND (ID1='.$id.' OR ID2='.$id.')', 'ORDER BY (ID1+ID2)');
				if ($friends['err'] > 0 ) return $friends;
				
				$res = Array ();
				$n = 0;
				
				foreach ($friends['records'] as $row) {
					$res[$n] = parent::getRecords ('OBJECTS AS O LEFT JOIN ALIASES AS A ON O.ALIAS_ID=A.ID', 'O.ID AS ID, O.NAME AS NAME, A.ID AS ALIAS_ID, A.ALIAS AS ALIAS', "O.ID=".($row['ID1']+$row['ID2']-$id));
					
					if ($res[$n]['err'] > 0) return $res[$n]['err'];
					else {
						$res[$n] = $res[$n]['records'][0];
						++$n;
					}
				}
				
				return Array('err'=>0, 'friendList'=>$res);
			}
			
		}
	
		public function changePublic ($objectId, $publicOption = '1-PUBLIC') {
			$update = Array ('PUBLIC'=>$publicOption);
			if (parent::updateRecords ('OBJECTS', $update, 'ID='.$objectId) > 0) return false;
			else return true;
		}
	
		public function addContent ($objectId, $name, $HTML) {
			return $this->addObject ($objectId, $name, 1, 2, '{"time":'.time().', "HTML": "'.$HTML.'"}');
		}
		
		public function updateContent ($objectId, $newContentJSONText) {
			$update = Array ('TAGS'=>'"'.$newContentJSONText.'"');
			return parent::updateRecords ('OBJECTS', $update, 'ID='.$objectId);
		}
				
		public function chat ($objectId1, $objectId2, $message = '') {
			$id1 = min($objectId1, $objectId2);
			$id2 = max($objectId1, $objectId2);
			//przysz³a nowa treœæ
			if ($message != '') {
				//rozpoczynamy rozmowê
				$count = parent::getRecords('CHAT', 'COUNT(*) AS NUM', 'ID1='.$id1.' AND ID2='.$id2);
				if ($count['err'] > 0 ) return $count;
				else $count = $count['records'][0]['NUM'];
				
				if ($count == 0) {
					$record = Array('ID1' => $id1, 'ID2' => $id2, 'NEWS1' => ($id1==$objectId1 ? 0 : 1), 'NEWS2' => ($id1==$objectId1 ? 1 : 0), 'CONTENT'=>'#'.$objectId1.'#'.$message);
					return parent::addRecord ('CHAT', $record);
				}
				else {
					$update = Array (($objectId1==$id1 ? 'NEWS2' : 'NEWS1')=>1, 'CONTENT'=>'CONCAT(CONTENT, \'#'.$objectId1.'#'.$message.'\')');
					return parent::updateRecords ('CHAT', $update, 'ID1='.$id1.' AND ID2='.$id2);
				}
			}
			
			$res = parent::getRecords ('CHAT', 'CONTENT', 'ID1='.$id1.' AND ID2='.$id2);
			
			if ($res['err'] > 0 ) return $res;
			$res['content'] = $res['records'][0]['CONTENT'];
			unset ($res['records']);
			
			return $res;
		}
	
		public function call ($objectId1, $objectId2) {
			$update = Array('EASYRTC_OBJECT_ID'=>$objectId1, 'EASYRTC_CALLED_OBJECT_ID'=>$objectId2);
			$res = parent::updateRecords('USERS', $update, 'OBJECT_ID='.$_SESSION['ID']);
			if ($res['err']>0) return $res;
			
			
			$o2 = Array('ID'=>-1, 'PARENT_ID'=>$objectId2);
			while ($o2['ID'] != $o2['PARENT_ID']) {
				$o2['ID'] = $o2['PARENT_ID'];
				
				$tmp = parent::getRecords('OBJECTS', 'ID, PARENT_ID', 'ID='.$o2['ID']);
				if ($tmp['err']>0) return $tmp;
				
				$o2['PARENT_ID'] = $tmp['records'][0]['PARENT_ID'];
			}
			
			$tmp = parent::getRecords('USERS', 'EASYRTC_ID', 'OBJECT_ID='.$o2['ID']);
			if ($tmp['err']>0) return $tmp;
			return Array('easyRTCId'=>$tmp['records'][0]['EASYRTC_ID']);
			
		}
	
		public function callInfo ($easyRTCId) {
			$tmp = parent::getRecords('(USERS AS U JOIN OBJECTS AS O ON U.EASYRTC_OBJECT_ID = O.ID) JOIN ALIASES AS A ON O.ALIAS_ID=A.ID', 'O.ID as id, O.NAME as name, A.ALIAS as alias, U.EASYRTC_CALLED_OBJECT_ID as callTo', 'U.EASYRTC_ID=\''.$easyRTCId.'\'');
			if ($tmp['err'] > 0) return $tmp;
			return $tmp['records'][0];
		}
	
		public function callCheckIn ($easyRTCId) {
			$update = Array('EASYRTC_ID'=>'\''.$easyRTCId.'\'');
			return parent::updateRecords('USERS', $update, 'OBJECT_ID='.$_SESSION['ID']);
		}
	
	
		public function transfer ($fromId, $toId, $amount) {
			$res = parent::getRecords ('OBJECTS', 'ACCOUNT', 'ID='.$fromId);
			if ($res['err']>0) return $res;
			
			$res['account'] = floatval ($res['records'][0]['ACCOUNT']);
			unset($res['records']);
			settype($amount, 'float');
			
			if ($amount > $res['account']) {
				$res['err'] = 1;
				$res['errMsg'] = 'Too big amount';
				return $res;
			}
			
			$update = Array('ACCOUNT'=>'ACCOUNT-'.$amount);
			$temp = parent::updateRecords('OBJECTS', $update, 'ID='.$fromId);
			if ($temp['err']>0) return $temp;
			
			$update = Array('ACCOUNT'=>'ACCOUNT+'.$amount);
			$temp = parent::updateRecords('OBJECTS', $update, 'ID='.$toId);
			if ($temp['err']>0) return $temp;
			
			$res['account'] -= $amount;
			
			return $res;
			
		}
	
		public function vote ($toId, $fromId=0, $vote = 1000) {
			$res = parent::getRecords('OBJECTS', 'REPUTATION', 'ID='.$toId);
			
			if ($res['err'] > 0) return $res;
			
			$res['reputation'] = json_decode($res['records'][0]['REPUTATION'], true);
			unset ($res['records']);
			
			if ($vote < -1 || $vote > 1) return $res;
			
			$t = 0.95*atan(pow($res['reputation']['votes'], 0.7))*2/pi();//0.0 - 0.95 - waga starych komentarzy
			$w = 1 - $t; //pocz¹tkowa, pe³na waga nowego komentarza
			
			$temp = parent::getRecords('OBJECTS', 'REPUTATION', 'ID='.$fromId);
			if ($temp['err'] == 0) {
				$rep = json_decode($temp['records'][0]['REPUTATION'], true);
				$w *= (atan(log(1+$rep['votes']))*2/pi()) * (($rep['avg']+1)/2);
			}
			else {
				$w = 0;
			}
			
			
			$res['reputation']['avg'] = (1-$w)*$res['reputation']['avg'] + $w*$vote;
			$res['reputation']['votes']++;
			
			$update = Array ('REPUTATION'=>'\''.json_encode($res['reputation']).'\'');
			$res2 = parent::updateRecords('OBJECTS', $update, 'ID='.$toId);
			if ($res2['err']>0) return $res2;
			
			return $res;
			
			
		}
	}
	
?>