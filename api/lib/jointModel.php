<?php
	class jointModel extends database {
		function __construct () {
			parent::init ();
		}
		
		function databaseError ($res) {
			return Array('status'=>false, 'error'=>Array('type'=>'database', 'code'=>$res['err'], 'msg'=>$res['errMsg']));
		}
		
		function authError () {
			return Array('status'=>false, 'error'=>Array('type'=>'userData', 'msg'=>'Authorization error'));
		}
		
		function success ($data = Array()) {
			return Array('status'=>true, 'data'=>$data);
		}
		
		function login ($username, $password) {
			$res = parent::getRecords('USERS', 'OBJECT_ID', 'LOGIN=\''.$username.'\' AND PASSWORD=\''.$password.'\'');
			if ($res['err'] > 0) return $this->databaseError($res);
			
			//bledna autoryzacja
			if (isset($res['records'][0]) == false ) {
				return $this->authError();
			}
			else {
				$_SESSION['ID'] = $res['records'][0]['OBJECT_ID'];
				return Array('status'=>true, 'data'=>$res['records'][0]);
			}
			
		}
		
		public function signup ($login, $name, $password) {
			//tworzymy usera
			$record = Array ('LOGIN'=>$login, 'NAME'=>$name, 'PASSWORD'=>$password, 'OBJECT_ID'=>1);
			$tmp = parent::addRecord('USERS', $record);
			if ($tmp['err'] > 0) return $this->databaseError ($tmp);
			
			//tworzymy obiekt
			$record = Array ('NAME'=>$name, 'PUBLIC'=>0, 'TYPE'=>0, 'TAGS'=>'{}', 'PARENT_ID'=>1, 'ALIAS_ID'=>1);
			$tmp = (parent::addRecord('OBJECTS', $record));
			if ($tmp['err'] > 0) $this->databaseError ($tmp);
			$res['objectId'] = parent::insertId();
			
			//tworzymy alias
			$record = Array ('OBJECT_ID'=>$res['objectId'], 'ALIAS'=>$name);
			$tmp = (parent::addRecord('ALIASES', $record));
			if ($tmp['err'] > 0) return $this->databaseError ($tmp);
			$res['aliasId'] = parent::insertId();
			
			//aktualizujemy
			$update = Array ('PARENT_ID'=>'ID', 'ALIAS_ID'=>$res['aliasId']);
			$tmp = (parent::updateRecords('OBJECTS', $update, 'ID='.$res['objectId']));
			if ($tmp['err'] > 0) return $this->databaseError ($tmp);
			
			$update = Array ('OBJECT_ID'=>$res['objectId']);
			$tmp = (parent::updateRecords('USERS', $update, 'LOGIN=\''.$login.'\''));
			if ($tmp['err'] > 0) return $this->databaseError ($tmp);
			
			//jeœli wszystko sie udalo, autoryzujemy sesje
			$_SESSION['ID'] = $res['objectId'];
			return $this->success($res);
									
		}
		
		/*jako $objectId przy tej funkcji podajemy zawsze id G£ÓWNEGO obiektu danego uzytkownika, poniewaz aliasy sa globalne*/
		public function addAlias ($aliasName) {
			if (isset($_SESSION['ID'])) $objectId = $_SESSION['ID'];
			else return $this->authError();
			
			$record = Array ('OBJECT_ID'=>$objectId, 'ALIAS'=>$aliasName);
			$res = parent::addRecord ('ALIASES', $record);
			if ($res['err'] == 0) return $this->success(Array('id' => parent::insertId()));
			return $this->databaseError($res);
		}
		
		public function removeAlias ($aliasId, $altAliasId) {
			$update = Array ('ALIAS_ID'=>$altAliasId);
			$res =  parent::updateRecords('OBJECTS', $update, 'ALIAS_ID='.$aliasId);
			if ($res['err']>0) return $this->databaseError($res);
			
			$res = (parent::removeRecords ('ALIASES', 'ID='.$aliasId));
			if ($res['err']>0) return $this->databaseError($res);
			
			return $this->success();
		}
		
		public function changeAlias ($objectId, $newAliasId, $children=false) {
			$record = Array ('ALIAS_ID'=>$newAliasId);
			$res = parent::updateRecords ('OBJECTS', $record, 'ID='.$objectId);
			if ($res['err']>0) return $this->databaseError($res);
			
			if ($children !== false) {
				$res = parent::getRecords('OBJECTS', 'ID', 'PARENT_ID='.$objectId.' AND ID!=PARENT_ID');
				if ($res['err'] > 0) return $this->databaseError($res);
				foreach ($res['records'] as $i=>$row) {
					//var_dump($row);
					$res2 = $this->changeAlias ($row['ID'], $newAliasId, true);
					if ($res2['err']>0) return $this->databaseError($res2);
				}
				unset($res['records']);
			}
			
			return $this->success();
		}
	
		public function getAliases ($objectId = -1) {
			if (($objectId == -1)) {
				if (isset($_SESSION['ID'])) $objectId = $_SESSION['ID'];
				else return $this->authError();
			}
			$res =  database::getRecords ('ALIASES', 'ID, ALIAS', 'OBJECT_ID='.$objectId, 'ORDER BY ID ASC');
			
			if ($res['err']>0) return $this->databaseError($res);
			return $this->success($res['records']);
		}
				
		public function addObject ($parentId, $name, $public, $type, $tags, $aliasId=0) {
			$record = Array ('PARENT_ID'=>$parentId, 'NAME'=>$name, 'PUBLIC'=>$public, 'TYPE'=>$type, 'TAGS'=>$tags, 'ALIAS_ID'=>$aliasId);
			
			$res = parent::addRecord ('OBJECTS', $record);
			if ($res['err'] > 0) return $this->databaseError($res);
			else return $this->success(parent::insertId());
			
		}
		
		public function removeObject ($objectId) {
			//usuwamy dzieci
			$res = parent::getRecords ('OBJECTS', 'ID', 'PARENT_ID='.$objectId.' AND ID!='.$objectId);
			if ($res['err'] > 0) return $this->databaseError($res);
			
			foreach ($res['records'] as $i => $row) {
				$res2 = $this->removeObject($row['ID']);
				if ($res2['status'] == false) return $res2;
			}
			
			$res = parent::removeRecords('OBJECTS', 'ID='.$objectId);
			if ($res['err'] > 0) return $this->databaseError($res);
			else return $this->success();
		}
		
		public function moveObject ($objectId, $newParentId) {
			$update = Array ('PARENT_ID' => $newParentId);
			$res = parent::updateRecords ('OBJECTS', $update, 'ID='.$objectId);
			if ($res['err'] > 0) return $this->databaseError($res);
			else return $this->success();
		}
		
		public function structure ($objectId = -1, $owner = true) {
			if (($objectId == -1) && isset($_SESSION['ID'])) $objectId = $_SESSION['ID'];
			else $owner = false;
			
			$res = parent::getRecords ('OBJECTS', '*', 'ID='.$objectId);
			if ($res['err'] > 0) return $this->databaseError($res);
				
			$n = 1;			
			for ($i=0;$i<$n;++$i) {
				//pobieramy dzieciaki dla naszego rekordu
				$res2 = parent::getRecords('OBJECTS', '*', 'PARENT_ID='.$res['records'][$i]['ID'].' AND ID!='.$res['records'][$i]['ID'].($owner===true ? '' : ' AND PUBLIC=1 AND TYPE=0'), 'ORDER BY ID');
				if ($res2['err'] > 0) return $this->databaseError($res2);
				
				foreach ($res2['records'] as $j=>$row) {
					$res['records'][$n] = $row;
					++$n;
				}
			}
			return $this->success($res['records']);
		}
	
		public function removeFriendship ($objectId1, $objectId2) {
			$tmp = parent::removeRecords ('FRIENDS', 'ABS(ID1)='.min($objectId1, $objectId2).' AND ABS(ID2)='.max($objectId1, $objectId2));
			if ($tmp['err'] > 0) return $this->databaseError($tmp);
			else return $this->success();
		}
		
		public function addFriendship ($objectId1, $objectId2) {
			/* wywo³anie tej funkcji oznacza, ¿e obiekt1 jest zainteresowany przyjaŸni¹ z obiektem2. 
			Jeœli obiekt 2 wczeœniej by³ zsainteresowany przyjaŸni¹, to nastêpuje wy³¹cznie modyfikacja rekordu w bazie danych
			w przeciwnym razie - treba doda rekord.
			Parametry przekazane do funkcji powinny byæ dodatnie, choæ w bazie danych liczby mog¹ by ujemne			*/
			
			$record = parent::getRecords('FRIENDS', 'ID1, ID2', 'ABS (ID1)='.min($objectId1, $objectId2).' AND ABS(ID2)='.max($objectId1, $objectId2));
			if ($record['err'] > 0)  return $this->databaseError($record);
			else $record = $record['records'][0];
			
			
			
			//jeœli cos ju¿ by³o
			if (isset($record['ID1'])) {
				if (($record['ID1'] == -$objectId1) || ($record['ID2'] == -$objectId1) ) {
					$update = Array ('ID1'=>'ABS(ID1)','ID2'=>'ABS(ID2)');
					$temp = parent::updateRecords('FRIENDS', $update, 'ID1='.$record['ID1'].' AND ID2='.$record['ID2']);
					if ($temp['err'] > 0) return $this->databaseError($temp);
					else {
						$record['ID1'] = abs($record['ID1']);
						$record['ID2'] = abs($record['ID2']);	
						return $this->success($record);
					}
				}
				else return $this->success($record);
			}
			else {
				$record = ($objectId1 < $objectId2) ? Array ('ID1' => $objectId1, 'ID2' => -$objectId2) : Array ('ID1' => -$objectId2, 'ID2' => $objectId1);
				$temp = parent::addRecord ('FRIENDS', $record);
				if ($temp['err'] > 0) return $this->databaseError($temp);
				else return $this->success($record);				
			}
		}
	
		public function friendList ($objectId) {
			$object=parent::getRecords('OBJECTS', '*', 'ID='.$objectId);
			if ($object['err'] > 0) return $this->databaseError($object);
			else $object = $object['records'][0];
			
			$id = $object['ID'];
			$type = $object['TYPE'];
			
			if ($type == 1) {
				$parentId = $object['PARENT_ID'];
				
				$parentFriendList = parent::getRecords('FRIENDS', 'ID1+ID2-'.$parentId.' AS ID', 'ID1>0 AND ID2>0 AND (ID1='.$parentId.' OR ID2='.$parentId.')');
				if ($parentFriendList['err'] > 0 ) return $this->databaseError($parentFriendList);
				
				$parentFriendString = '(-1,';
				foreach ($parentFriendList['records'] as $row) {
					$parentFriendString .= $row['ID'].',';
				}
				$parentFriendString = substr ($parentFriendString, 0, -1).')';
				
				$temp = parent::getRecords ('`OBJECTS` LEFT JOIN `ALIASES` ON OBJECTS.ALIAS_ID=ALIASES.ID',
				'OBJECTS.ID AS ID, OBJECTS.PARENT_ID AS PARENT_ID, OBJECTS.NAME AS NAME, OBJECTS.TAGS AS TAGS, OBJECTS.ALIAS_ID AS ALIAS_ID, ALIASES.ALIAS AS ALIAS_NAME',
				'OBJECTS.ID !='.$id.' AND OBJECTS.TYPE=1 AND NOT (OBJECTS.PARENT_ID IN '.$parentFriendString.')', 
				'ORDER BY OBJECTS.ID');
				if ($temp['err'] > 0) return $this->databaseError($temp);
				$res = Array (); $n = 0;
				foreach ($temp['records'] as $row) {
					if (objectMatch::match($row, $object)) { 
						$res[$n] = $row;
						++$n;
					}
				}
				return $this->success($res);
			}
			else {
				$friends = parent::getRecords ('FRIENDS', '*', 'ID1>0 AND ID2>0 AND (ID1='.$id.' OR ID2='.$id.')', 'ORDER BY (ID1+ID2)');
				if ($friends['err'] > 0 ) return $this->databaseError($friends);
				
				$res = Array ();
				$n = 0;
				
				foreach ($friends['records'] as $row) {
					$res[$n] = parent::getRecords ('OBJECTS AS O LEFT JOIN ALIASES AS A ON O.ALIAS_ID=A.ID', 'O.ID AS ID, O.NAME AS NAME, A.ID AS ALIAS_ID, A.ALIAS AS ALIAS', "O.ID=".($row['ID1']+$row['ID2']-$id));
					
					if ($res[$n]['err'] > 0) return $this->databaseError($res[$n]);
					else {
						$res[$n] = $res[$n]['records'][0];
						++$n;
					}
				}
				
				return $this->success($res);
			}
			
		}
	
		public function changePublic ($objectId, $publicOption = '1-PUBLIC') {
			$update = Array ('PUBLIC'=>$publicOption);
			$tmp = parent::updateRecords ('OBJECTS', $update, 'ID='.$objectId);
			if ($tmp['err']>0) return $this->databaseError($tmp);
			else return $this->success();
		}
	
		public function addContent ($objectId, $name, $HTML) {
			return $this->addObject ($objectId, $name, 1, 2, '{"time":'.time().', "HTML": "'.$HTML.'"}');
		}
		
		public function updateContent ($objectId, $newContentJSONText) {
			$update = Array ('TAGS'=>'"'.$newContentJSONText.'"');
			$tmp = parent::updateRecords ('OBJECTS', $update, 'ID='.$objectId);
			if ($tmp['err']>0) return $this->databaseError($tmp);
			else return $this->success();
		}
				
		public function chat ($objectId1, $objectId2, $message = '') {
			$id1 = min($objectId1, $objectId2);
			$id2 = max($objectId1, $objectId2);
			//przysz³a nowa treœæ
			if ($message != '') {
				//rozpoczynamy rozmowê
				$count = parent::getRecords('CHAT', 'COUNT(*) AS NUM', 'ID1='.$id1.' AND ID2='.$id2);
				if ($count['err'] > 0 ) return $this->databaseError($count);
				else $count = $count['records'][0]['NUM'];
				
				if ($count == 0) {
					$record = Array('ID1' => $id1, 'ID2' => $id2, 'NEWS1' => ($id1==$objectId1 ? 0 : 1), 'NEWS2' => ($id1==$objectId1 ? 1 : 0), 'CONTENT'=>'#'.$objectId1.'#'.$message);
					$tmp = parent::addRecord ('CHAT', $record);
					if ($tmp['err']>0) return $this->databaseError($tmp);
					else return $this->success();
				}
				else {
					$update = Array (($objectId1==$id1 ? 'NEWS2' : 'NEWS1')=>1, 'CONTENT'=>'CONCAT(CONTENT, \'#'.$objectId1.'#'.$message.'\')');
					$tmp = parent::updateRecords ('CHAT', $update, 'ID1='.$id1.' AND ID2='.$id2);
					if ($tmp['err']>0) return $this->databaseError($tmp);
					else return $this->success();
				}
			}
			
			$res = parent::getRecords ('CHAT', 'CONTENT', 'ID1='.$id1.' AND ID2='.$id2);
			
			if ($res['err'] > 0 ) return $this->databaseError($res);
			return $this->success( $res['records'][0]['CONTENT'] );
		}
	
		public function call ($objectId1, $objectId2) {
			$update = Array('EASYRTC_OBJECT_ID'=>$objectId1, 'EASYRTC_CALLED_OBJECT_ID'=>$objectId2);
			$res = parent::updateRecords('USERS', $update, 'OBJECT_ID='.$_SESSION['ID']);
			if ($res['err']>0) return $this->databaseError($res);
			
			
			$o2 = Array('ID'=>-1, 'PARENT_ID'=>$objectId2);
			while ($o2['ID'] != $o2['PARENT_ID']) {
				$o2['ID'] = $o2['PARENT_ID'];
				
				$tmp = parent::getRecords('OBJECTS', 'ID, PARENT_ID', 'ID='.$o2['ID']);
				if ($tmp['err']>0) return $this->databaseError($tmp);
				
				$o2['PARENT_ID'] = $tmp['records'][0]['PARENT_ID'];
			}
			
			$tmp = parent::getRecords('USERS', 'EASYRTC_ID', 'OBJECT_ID='.$o2['ID']);
			if ($tmp['err']>0) return $this->databaseError($tmp);
			else return $this->success($tmp['records'][0]['EASYRTC_ID']);
			
		}
	
		public function callInfo ($easyRTCId) {
			$tmp = parent::getRecords('(USERS AS U JOIN OBJECTS AS O ON U.EASYRTC_OBJECT_ID = O.ID) JOIN ALIASES AS A ON O.ALIAS_ID=A.ID', 'O.ID as id, O.NAME as name, A.ALIAS as alias, U.EASYRTC_CALLED_OBJECT_ID as callTo', 'U.EASYRTC_ID=\''.$easyRTCId.'\'');
			if ($tmp['err'] > 0) return $this->databaseError($tmp);
			return $this->success($tmp['records'][0]);
		}
	
		public function callCheckIn ($easyRTCId) {
			$update = Array('EASYRTC_ID'=>'\''.$easyRTCId.'\'');
			$tmp = parent::updateRecords('USERS', $update, 'OBJECT_ID='.$_SESSION['ID']);
			if ($tmp['err'] > 0 ) return $this->databaseError($tmp);
			else return $this->success();
		}
	
	
		public function transfer ($fromId, $toId, $amount) {
			$res = parent::getRecords ('OBJECTS', 'ACCOUNT', 'ID='.$fromId);
			if ($res['err']>0) return $this->databaseError($res);
			
			$res['account'] = floatval ($res['records'][0]['ACCOUNT']);
			unset($res['records']);
			settype($amount, 'float');
			
			if ($amount > $res['account']) {
				return Array('status'=>false, 'err'=> Array ('type'=> 'userData', 'msg'=>'Amount can not be bigger than'.$rec['account']));
			}
			
			$update = Array('ACCOUNT'=>'ACCOUNT-'.$amount);
			$temp = parent::updateRecords('OBJECTS', $update, 'ID='.$fromId);
			if ($temp['err']>0) return $this->databaseError($temp);
			
			$update = Array('ACCOUNT'=>'ACCOUNT+'.$amount);
			$temp = parent::updateRecords('OBJECTS', $update, 'ID='.$toId);
			if ($temp['err']>0) return $this->databaseError($temp);
			
			$res['account'] -= $amount;
			
			return $this->success($res['account']);
			
		}
	
		public function vote ($toId, $fromId=0, $vote = 1000) {
			$res = parent::getRecords('OBJECTS', 'REPUTATION', 'ID='.$toId);
			
			if ($res['err'] > 0) return $this->databaseError($res);
			
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
				return $this->databaseError($temp);
			}
			
			
			$res['reputation']['avg'] = (1-$w)*$res['reputation']['avg'] + $w*$vote;
			$res['reputation']['votes']++;
			
			$update = Array ('REPUTATION'=>'\''.json_encode($res['reputation']).'\'');
			$res2 = parent::updateRecords('OBJECTS', $update, 'ID='.$toId);
			if ($res2['err']>0) return $this->databaseError($res2);
			
			return $this->success($res['reputation']);
			
			
		}
	}
	
?>