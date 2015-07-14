<?php
	require_once('objectMatch.php');
    
    function sortPoints($a,$b) {        
        return strcasecmp($a->value,$b->value);
    }

	class jointModel extends database {
		function __construct () {
			parent::init ();
			
			$this->_searchTypeId = 8;
            $this->_contentTypeId = 7;
			
			$this->_actionTypes=Array('offerFriendship', 'confirmFriendship', 'removeFriendship', 'chatMessage');
			$this->_actionCodes=Array();
			foreach ($this->_actionTypes as $k=>$v) $this->_actionCodes[$v]=$k;
			
            
			$this->_match = new objectMatch;
		}
		
		function setInfo ($recipientId, $actionType, $senderId) {
			
			//data processing
			switch ($actionType) {
				case 'removeFriendship':
				
				break;
				case 'offerFriendship':
				
				break;
				case 'chatMessage':
				
				break;
			}
			
			$actionCode = $this->_actionCodes[$actionType];
			//end of data processing
			$record = Array('RECIPIENT_ID'=>$this->getRootObjectID($recipientId), 'SENDER_ID'=>$senderId, 'ACTION_TYPE'=>$actionCode, 'DETAILS'=>$recipientId);
			
			try {
				parent::addRecord('ACTION_INFO', $record);
			}
			catch (Exception $e) {
				return false;
			}
			
			return true; 

		}
		
		function getInfo () {
			if ( ! isset($_SESSION['ID'])) return $this -> authError();
			
			$from = 'ACTION_INFO A LEFT JOIN OBJECTS O ON O.ID = A.SENDER_ID LEFT JOIN ALIASES AL ON AL.ID = O.ALIAS_ID';
			$fields = 'A.ID, A.SENDER_ID, A.ACTION_TYPE, A.DETAILS, A.TIME_STAMP, O.NAME, AL.ALIAS';
			$where = 'A.RECIPIENT_ID='.$_SESSION['ID'];
			
			$tmp = parent::getRecords($from, $fields, $where);
			$res = Array();
			foreach ($this->_actionTypes as $a) $res[$a]=Array();
			foreach($tmp as $row) {
				array_push ($res[$this->_actionTypes[$row['ACTION_TYPE']]], Array('ID'=>$row['ID'],'SENDER'=>$row['SENDER_ID'], 'RECIPIENT'=>$row['DETAILS'], 'NAME'=>$row['NAME'],'ALIAS'=>$row['ALIAS']));
			}
			//parent::removeRecords('ACTION_INFO', 'RECIPIENT_ID='.$_SESSION['ID']);
			
			return $this->success($res);
			
		}
		
		function authError () {
			return Array('status'=>false, 'error'=>Array('type'=>'userData', 'msg'=>'Authorization error'));
		}
		
		function success ($data = Array()) {
			return Array('status'=>true, 'data'=>$data);
		}
		
		function getRootObjectID ($o) {
			$type = gettype ($o);
			if ($type == 'object' || $type=='array') {
				if ($o['PARENT_ID'] == 0) return $o['ID'];
				else $id = $o['ID'];
			}
			else if ($type == 'string' || $type='integer') {
				$id = $o;
			}
			else return false;
			
			for (;;) {
				$tmp = parent::getRecords('OBJECTS', 'PARENT_ID', 'ID='.$id);
				if ($tmp[0]['PARENT_ID'] == 0) return $id;
				else $id = $tmp[0]['PARENT_ID'];
			}
		}
        
        function sortPoints(&$points) {            
            usort($points,'sortPoints');            
            return $points;
        }
		
		function getObject ($row) {
		    
			$row['REPUTATION'] = json_decode($row['REPUTATION']);
            
            if(!$row['REPUTATION']) {
                $row['REPUTATION'] = (object)Array('avg'=>0,'votes'=>0);    
            }
            
			$row['TAGS'] = json_decode($row['TAGS']);
			
			if($row['TAGS']->content_html) {
				$row['TAGS']->content_html = html_entity_decode(urldecode($row['TAGS']->content_html));
			}            
            
            foreach($row['TAGS'] as $scopeId=>&$scope) {
                foreach($scope as $tagId=>&$tag) {
                    if($tag->points) { $tag->points = $this->sortPoints($tag->points); }
                    if($tag->_values) { $tag->_values = $this->sortPoints($tag->_values); }
                }                    
            }            
			
			return $row;
		}
        
        function serializeObject(&$row) {
        	
			$row['NAME'] = strip_tags($row['NAME']);
            
            $jsonableFields = Array('TAGS','REPUTATION');
			$quoteFields = Array('content_html');
            
            foreach($jsonableFields as $f) {
                if(isset($row[$f])) {
                	foreach($quoteFields as $q) {
                		if($row[$f][$q]) {
                			$row[$f][$q] = urlencode(htmlentities($row[$f][$q],ENT_QUOTES)); //;
                            //var_dump($row[$f][$q]);
                		}
                	}
                    $row[$f] = json_encode($row[$f]);
                }
            }
			//var_dump($row);
            return;
            
        }
		
		function login ($username, $password) {
		    
            if(!$username || !$password) {
                return $this->authError();
            }
            
			$res = parent::getRecords('USERS', 'LOGIN,OBJECT_ID', 'LOGIN=\''.$username.'\' AND PASSWORD=\''.$password.'\'');
			
			//bledna autoryzacja
			if (isset($res[0]) == false ) {
				return $this->authError();
			}
			else {
				$_SESSION['ID'] = $res[0]['OBJECT_ID'];
				return $this->success($res[0]);
			}
		}
		//PARENT_ID
		public function signup ($login, $name, $password) {
		    //sprawdzamy czy login jest unikalny
		    $check = $this->getRecords('USERS','OBJECT_ID','LOGIN=\''.$login.'\'');
            
            if(!$login || !$name || !$password) {
                return Array('status'=>false,'error'=>'Please provide login, alias name and password');
            }
            
            if($check[0]['OBJECT_ID']) {
                return Array('status'=>false,'error'=>'The username '.$login.' is already taken');
            }
            
            
			//tworzymy obiekt
			$record = Array ('NAME'=>$name, 'PUBLIC'=>0, 'TYPE'=>0, 'TAGS'=>'{}', 'PARENT_ID'=>0, 'ALIAS_ID'=>1);
			$tmp = (parent::addRecord('OBJECTS', $record));
			$res['object_id'] = parent::insertId();
			$res['objectId'] = $res['object_id'];
			
			//tworzymy usera
			$record = Array ('LOGIN'=>$login, 'NAME'=>$name, 'PASSWORD'=>$password, 'OBJECT_ID'=>$res['objectId']);
			$tmp = parent::addRecord('USERS', $record);
			
			//tworzymy alias
			$record = Array ('OBJECT_ID'=>$res['objectId'], 'ALIAS'=>$name);
			$tmp = (parent::addRecord('ALIASES', $record));
			$res['aliasId'] = parent::insertId();
			
			//aktualizujemy
			
			$update = Array ('OBJECT_ID'=>$res['objectId']);
			$tmp = (parent::updateRecords('USERS', $update, 'LOGIN=\''.$login.'\''));
			
			$res['login'] = $login;
			
			//je�li wszystko sie udalo, autoryzujemy sesje
			$_SESSION['ID'] = $res['objectId'];
			return $this->success($res);
									
		}

		public function checkSession() {
			return $this->success(Array('object_id'=>$_SESSION['ID']));
		}
		
		/*jako $objectId przy tej funkcji podajemy zawsze id G��WNEGO obiektu danego uzytkownika, poniewaz aliasy sa globalne*/
		public function addAlias ($aliasName) {
			if (isset($_SESSION['ID'])) $objectId = $_SESSION['ID'];
			else return $this->authError();
			
			$record = Array ('OBJECT_ID'=>$objectId, 'ALIAS'=>$aliasName);
			$res = parent::addRecord ('ALIASES', $record);
			return $this->success(Array('id' => parent::insertId(), 'alias'=>$aliasName));
		}
		
		public function removeAlias ($aliasId, $altAliasId) {
			$update = Array ('ALIAS_ID'=>$altAliasId);
			parent::updateRecords('OBJECTS', $update, 'ALIAS_ID='.$aliasId);
			
			parent::removeRecords ('ALIASES', 'ID='.$aliasId);
			
			return $this->success();
		}
        
        public function updateAlias($aliasId, $record) {
            
            $filter = Array('ALIAS','INFO','IMAGE');
            
            foreach($record as $k=>$v) {
                if(!in_array($k,$filter)) { unset($record[$k]); }
            }       
            
            $record = $this->quote($record);     
            
            parent::updateRecords ('ALIASES', $record, 'ID='.$aliasId);
            $res = parent::getRecords('ALIASES', '*', 'ID='.$aliasId, 'ORDER BY ID DESC LIMIT 1');
            return $this->success($this->getObject($res[0]));
            
        }
		
		public function changeAlias ($objectId, $newAliasId, $children=false) {
			$record = Array ('ALIAS_ID'=>$newAliasId);
			$res = parent::updateRecords ('OBJECTS', $record, 'ID='.$objectId);
			
			if ($children !== false) {
				$res = parent::getRecords('OBJECTS', 'ID', 'PARENT_ID='.$objectId);
				foreach ($res as $i=>$row) {
					//var_dump($row);
					$res2 = $this->changeAlias ($row['ID'], $newAliasId, true);
				}
				unset($res);
			}
			
			return $this->success(Array('newAliasId'=>$newAliasId));
		}
	
		public function getAliases ($objectId = -1) {
			if (($objectId == -1)) {
				if (isset($_SESSION['ID'])) $objectId = $_SESSION['ID'];
				else return $this->authError();
			}
			$res =  database::getRecords ('ALIASES', 'ID, ALIAS, INFO, IMAGE', 'OBJECT_ID='.$objectId, 'ORDER BY ALIAS ASC');
			
			return $this->success($res);
		}
				
		public function addObject ($parentId, $record) {
			
			$this->serializeObject($record);
		    
            $filter = Array('NAME','PUBLIC','TYPE','TAGS','ALIAS_ID');
            
            foreach($record as $k=>$v) {
                if(!in_array($k,$filter)) { unset($record[$k]); }
            }
			
			$parentObject = $this->getRecords('OBJECTS','*','ID='.$parentId);
			$parentObject = $parentObject[0];
			
			if(!$record['ALIAS_ID']) { $record['ALIAS_ID'] = $parrentObject['ALIAS_ID']; }
			$record['TIME_ADD'] = time();
			
			$record['PARENT_ID'] = $parentId;
			parent::addRecord ('OBJECTS', $record);
			$res = parent::getRecords('OBJECTS', '*', 'PARENT_ID='.$parentId, 'ORDER BY ID DESC LIMIT 1');
			return $this->success($this->getObject($res[0]));
            
		}
		
		private function quote($array) {
			foreach($array as $key => $value) {
				$array[$key] = '\''.$value.'\'';
			}
			return $array;
		}
        
        public function updateObject($objectId, $record) {
            
            $this->serializeObject($record);                   
                        
            $filter = Array('NAME','PUBLIC','TYPE','TAGS','ALIAS_ID');
            
            foreach($record as $k=>$v) {
                if(!in_array($k,$filter)) { unset($record[$k]); }
            }       
			
			$record = $this->quote($record);     
            
            parent::updateRecords ('OBJECTS', $record, 'ID='.$objectId);
            $res = parent::getRecords('OBJECTS', '*', 'ID='.$objectId, 'ORDER BY ID DESC LIMIT 1');
            return $this->success($this->getObject($res[0]));
            
        }
		
		public function removeObject ($objectId) {
			//usuwamy dzieci
			$res = parent::getRecords ('OBJECTS', 'ID', 'PARENT_ID='.$objectId);
			
			foreach ($res as $i => $row) {
				$this->removeObject($row['ID']);
			}
			
			$res = parent::removeRecords('OBJECTS', 'ID='.$objectId);
			return $this->success();
		}
		
		public function moveObject ($objectId, $newParentId) {
			$update = Array ('PARENT_ID' => $newParentId);
			parent::updateRecords ('OBJECTS', $update, 'ID='.$objectId);
			$res = parent::getRecords('OBJECTS', '*', 'ID='.$objectId);
			return $this->success($this->getObject($res[0]));
		}
		
		public function structure ($objectId = -1, $owner = true) {
			if (($objectId == -1) && isset($_SESSION['ID'])) $objectId = $_SESSION['ID'];
			else $owner = false;
			
			$res = parent::getRecords ('OBJECTS', '*', 'ID='.$objectId);
			$res[0] = $this->getObject($res[0]);
				
			$n = 1;			
			for ($i=0;$i<$n;++$i) {
				//pobieramy dzieciaki dla naszego rekordu
				$res2 = parent::getRecords('OBJECTS', '*', 'PARENT_ID='.$res[$i]['ID'].($owner===true ? '' : ' AND PUBLIC=1 AND TYPE!='.$this->_contentTypeId.' AND TYPE!='.$this->_searchTypeId).' AND TYPE!='.$this->_contentTypeId, 'ORDER BY ID');
				
				foreach ($res2 as $j=>$row) {
					$res[$n] = $row;
					$res[$n] = $this->getObject($res[$n]);
					++$n;
				}
			}
			return $this->success($res);
		}
        
        public function getObjectsByField($field,$value,$public=1) {
            
			$field = mb_convert_case($field,MB_CASE_UPPER);
			
			$wh = Array();
			$wh[] = $field.'='.$value;
			if($public) { $wh[] = 'PUBLIC=1'; }
			
            $res = parent::getRecords('OBJECTS', '*', $field.'='.$value.' AND PUBLIC='.$public.' ORDER BY NAME ASC');
			
			foreach($res as $k=>$r) {
				$res[$k] = $this->getObject($r);
			}
			
			if($field=='ID') { $res = $res[0]; }
			
            return $this->success($res);
            
        }
		
		public function getObjectsByParent($type) {
            
            $res = parent::getRecords('OBJECTS', '*', 'PARENT_ID='.$type.' AND PUBLIC=1');
            return $this->success($res);
            
        }
	
		public function removeFriendship ($objectId1, $objectId2) {
		    
            $objectId1 = $this->getFriendshipRoot($objectId1);
            $objectId2 = $this->getFriendshipRoot($objectId2);
            
            $this->removeFriendshipEvents($objectId1,$objectId2);
            
			parent::removeRecords ('FRIENDS', 'ABS(ID1)='.min($objectId1, $objectId2).' AND ABS(ID2)='.max($objectId1, $objectId2));
			$this -> setInfo ($objectId2, 'removeFriendship', $objectId1);
			return $this->success();
		}
        
        private function getFriendshipRoot($objectId) {            
            
            $rec = $this->getRecords('OBJECTS','if(TYPE='.$this->_searchTypeId.',PARENT_ID,ID) as "ID"','ID='.$objectId);
            $rec = $rec[0]['ID'];
            
            return $rec;
            
        }
        
        private function removeFriendshipEvents($objectId1,$objectId2) {
            $clearWhere = implode(' AND ',Array(
                '(DETAILS='.$objectId1.' OR DETAILS='.$objectId2.')',
                '(SENDER_ID='.$objectId1.' OR SENDER_ID='.$objectId2.')'
            ));            
            parent::removeRecords('ACTION_INFO', $clearWhere); 
        }
		
		public function addFriendship ($objectId1, $objectId2) {
		                
			/* wywo�anie tej funkcji oznacza, �e obiekt1 jest zainteresowany przyja�ni� z obiektem2. 
			Je�li obiekt 2 wcze�niej by� zsainteresowany przyja�ni�, to nast�puje wy��cznie modyfikacja rekordu w bazie danych
			w przeciwnym razie - treba doda rekord.
			Parametry przekazane do funkcji powinny by� dodatnie, cho� w bazie danych liczby mog� by ujemne			*/
			
			$objectId1 = $this->getFriendshipRoot($objectId1);
            $objectId2 = $this->getFriendshipRoot($objectId2);
            
            //czyści historię powiadomień dla przyjaźni
            $this->removeFriendshipEvents($objectId1,$objectId2);
			
			$record = parent::getRecords('FRIENDS', 'ID1, ID2', 'ABS (ID1)='.min($objectId1, $objectId2).' AND ABS(ID2)='.max($objectId1, $objectId2));
			$record = $record[0];
			
			//je�li cos ju� by�o
			if (isset($record['ID1'])) {
				if (($record['ID1'] == -$objectId1) || ($record['ID2'] == -$objectId1) ) {
					$update = Array ('ID1'=>'ABS(ID1)','ID2'=>'ABS(ID2)');
					parent::updateRecords('FRIENDS', $update, 'ID1='.$record['ID1'].' AND ID2='.$record['ID2']);
					
					$record['ID1'] = abs($record['ID1']);
					$record['ID2'] = abs($record['ID2']);

					$this->setInfo($objectId2, 'confirmFriendship', $objectId1); 
					$response = $this->success($record);
					
				}
				else {
				    $response = $this->success($record);
                }
			}
			else {
				$record = ($objectId1 < $objectId2) ? Array ('ID1' => $objectId1, 'ID2' => -$objectId2) : Array ('ID1' => -$objectId2, 'ID2' => $objectId1);
				parent::addRecord ('FRIENDS', $record);
				
				$this->setInfo($objectId2, 'offerFriendship', $objectId1); 
				$response = $this->success($record);				
			}
            
            return $response;
		}
	
		public function friendList ($objectId, $searchOnly = false) {
			
			$object=parent::getRecords('OBJECTS', '*', 'ID='.$objectId);
			$object = $object[0];
			
			$id = $object['ID'];
			$type = $object['TYPE'];
			
			if ($type == $this->_searchTypeId) {
				$parentId = $object['PARENT_ID'];
				
				$parentFriendList = parent::getRecords('FRIENDS', 'ID1+ID2-'.$parentId.' AS ID', 'ID1>0 AND ID2>0 AND (ID1='.$parentId.' OR ID2='.$parentId.')');
				
				$parentFriendString = '(-1,';
				foreach ($parentFriendList as $row) {
					$parentFriendString .= $row['ID'].',';
				}
				$parentFriendString = substr ($parentFriendString, 0, -1).')';
				
				$temp = parent::getRecords ('`OBJECTS` LEFT JOIN `ALIASES` ON OBJECTS.ALIAS_ID=ALIASES.ID',
				'OBJECTS.ID AS ID, OBJECTS.PARENT_ID AS PARENT_ID, OBJECTS.NAME AS NAME, OBJECTS.TAGS AS TAGS, OBJECTS.ALIAS_ID AS ALIAS_ID, ALIASES.ALIAS AS ALIAS, ALIASES.INFO AS ALIAS_INFO, ALIASES.IMAGE AS ALIAS_IMAGE, OBJECTS.TYPE AS TYPE',
				'OBJECTS.ID !='.$id.' AND OBJECTS.TYPE='.$this->_searchTypeId.' AND NOT (OBJECTS.PARENT_ID IN '.$parentFriendString.')', 
				'ORDER BY OBJECTS.ID');
				
				$res = Array (); $n = 0;
				foreach ($temp as $row) {
					if ($this->_match->match($row, $object)) {
						$res[$n] = $this->getObject($row);
                        $res[$n]['friends_with'] = $object;
						++$n;
					}
				}                
				//return $this->success($res);
			}
			else {
			    if(!$searchOnly) {
				$friends = parent::getRecords ('FRIENDS', '*', 'ID1>0 AND ID2>0 AND (ID1='.$id.' OR ID2='.$id.')', 'ORDER BY (ID1+ID2)');
				
				$res = Array ();
				$n = 0;
				
				foreach ($friends as $row) {
					$res[$n] = parent::getRecords ('OBJECTS AS O LEFT JOIN ALIASES AS A ON O.ALIAS_ID=A.ID', 'O.ID AS ID, O.NAME AS NAME, A.ID AS ALIAS_ID, A.ALIAS AS ALIAS, A.INFO AS ALIAS_INFO, A.IMAGE AS ALIAS_IMAGE, O.TYPE AS TYPE', "O.ID=".($row['ID1']+$row['ID2']-$id));					
					$res[$n] = $res[$n][0];
                    $friendObj = parent::getRecords('OBJECTS','*','ID='.$row['ID2']);
                    $res[$n]['friends_with'] = $friendObj[0];
					++$n;
				}				
				}  
				
			}

            foreach($res as $id=>$r) {
                if(!$r) { unset($res[$id]); }
            }
            return $this->success($res);
			
		}
	
		public function getFriendList ($objectId, $children = false) {
			
			$objectList = Array(0=>$objectId);
			if ($children == true) {
				for ($i=0; isset($objectList[$i]); ++$i) {
					$tmp = parent::getRecords('OBJECTS', 'ID', 'PARENT_ID='.$objectList[$i].' AND TYPE != '.$this->_searchTypeId);
					foreach ($tmp as $k=>$v) {
						array_push ($objectList, $v['ID']);
					}
				}
			}
			
			$res = Array();
			foreach ($objectList as $o) {
				$tmp = $this->friendList($o);
				foreach ($tmp['data'] as $k=>$v) {
				    if($v) {
					   array_push($res, $v);
                    }
				}
			}
			
			return $this->success($res);
		}
		
		public function getSearchList ($objectId, $children = false) {
			$objectList = Array(0=>$objectId);
			if ($children == true) {
				$searchList = Array(0=>$objectId);
				for ($i=0; isset($objectList[$i]); ++$i) {
					$tmp = parent::getRecords('OBJECTS', 'ID, TYPE', 'PARENT_ID='.$objectList[$i]);
					foreach ($tmp as $k=>$v) {
						if ($v['TYPE'] == $this->_searchTypeId) array_push($searchList, $v['ID']); 
						else array_push ($objectList, $v['ID']);
					}
				}
			}
			else {
				$searchList = Array(0=>$objectId);
			}
			
			$searchList = array_unique($searchList);
			
			$res = Array();
			foreach ($searchList as $o) {
				$tmp = $this->friendList($o,true);
				foreach ($tmp['data'] as $k=>$v) {
					array_push($res, $v);
				}
			}
			
			return $this->success($res);
		}
	
	
	
		public function changePublic ($objectId, $publicOption = '1-PUBLIC') {
			$update = Array ('PUBLIC'=>$publicOption);
			parent::updateRecords ('OBJECTS', $update, 'ID='.$objectId);
			$tmp = parent::getRecords('OBJECTS', '*', 'ID='.$objectId);
			return $this->success($tmp[0]);
		}
		
		public function getContents($objectId, $children = false) {
			
			$objectList = Array(0=>$objectId);
			$parentNames = Array();
			
			if ($children == true) {
				for ($i=0; isset($objectList[$i]); ++$i) {
					$tmp = parent::getRecords('OBJECTS', 'ID,NAME', 'PARENT_ID='.$objectList[$i].' AND TYPE != '.$this->_searchTypeId);
					foreach ($tmp as $k=>$v) {
						array_push ($objectList, $v['ID']);
						$parentNames[$v['ID']] = $v['NAME'];
					}
				}
			}
			
			$allObjectsIds = implode(',',array_values($objectList));
			
			//$where = 'PARENT_ID = '.$objectId.' AND TYPE = '.$this->_contentTypeId;
			$where = 'PARENT_ID IN ('.$allObjectsIds.') AND TYPE = '.$this->_contentTypeId;
			$where .= ' ORDER BY TIME_ADD DESC';
			$records = $this->getRecords('OBJECTS','*',$where);
			foreach($records as &$val) {
				$val = $this->getObject($val);
				$val['parent_name'] = $parentNames[$val['PARENT_ID']];
			}
			return $this->success($records);
			
		}
	
		public function addContent ($objectId, $name, $HTML) {
			return $this->addObject ($objectId, $name, 1, 2, '{"time":'.time().', "HTML": "'.$HTML.'"}');
		}
		
		public function updateContent ($objectId, $newContentJSONText) {
			$update = Array ('TAGS'=>'"'.$newContentJSONText.'"');
			parent::updateRecords ('OBJECTS', $update, 'ID='.$objectId);
			$tmp = parent::getRecords ('OBJECTS', '*', 'ID='.$objectId);
			return $this->success($this->getObject($tmp[0]));
		}
		
		public function importContent($objectId, $HTML, $url) {
			
			require_once(__DIR__.'/../tools/readability/Readability.php');
			$readability = new Readability($HTML, $url);
			$result = $readability->init();
			if ($result) {
				$data = Array(
					'NAME'=>$readability->getTitle()->textContent,
					'TAGS'=>Array(
						'content_type'=>'html',
						'content_html'=>$readability->getContent()->innerHTML
					),
					'TYPE'=>$this->_contentTypeId
				);
				return $this->addObject($objectId,$data);
			} else {
			}
			
			die();
			
		}

        private function chatToArray($chat) {
            
            $messages = Array();            
            $explode = explode('#',$chat);
			$usernames = Array();
            
            foreach($explode as $e) {
                if(!$key) {
                    $key = $e;
                } else {
                    $message = $e;
                }
                if($key&&$message) {
                	if(!$usernames[$key]) {
                		$obj = $this->getRecords('OBJECTS','*','ID='.$key);
						$alias = $this->getRecords('ALIASES','*','ID='.$obj[0]['ALIAS_ID']);
                		$usernames[$key] = $alias[0]['ALIAS'];
                	}
					$username = $usernames[$key];
                    $messages[] = Array('username'=>$username,'content'=>$message);
                    $key=false;
                    $message=false;
                }
                
            }
            
            return $messages;
               
        }
				
		public function chat ($objectId1, $objectId2, $message = '') {
			$id1 = min($objectId1, $objectId2);
			$id2 = max($objectId1, $objectId2);
			//przysz�a nowa tre��
			if ($message != '') {
				//rozpoczynamy rozmow�
				$count = parent::getRecords('CHAT', 'COUNT(*) AS NUM', 'ID1='.$id1.' AND ID2='.$id2);
				$count = $count[0]['NUM'];
				
				if ($count == 0) {
					$record = Array('ID1' => $id1, 'ID2' => $id2, 'NEWS1' => ($id1==$objectId1 ? 0 : 1), 'NEWS2' => ($id1==$objectId1 ? 1 : 0), 'CONTENT'=>'#'.$objectId1.'#'.$message);
					$tmp = parent::addRecord ('CHAT', $record);
				}
				else {
					$update = Array (($objectId1==$id1 ? 'NEWS2' : 'NEWS1')=>1, 'CONTENT'=>'CONCAT(CONTENT, \'#'.$objectId1.'#'.$message.'\')');
					$tmp = parent::updateRecords ('CHAT', $update, 'ID1='.$id1.' AND ID2='.$id2);
				}
				
				$this->setInfo ($objectId2, 'chatMessage', $objectId1);
				return $this->success($message);
			}
			else {
				$res = parent::getRecords ('CHAT', 'CONTENT', 'ID1='.$id1.' AND ID2='.$id2);
				return $this->success( $this->chatToArray($res[0]['CONTENT']) );
			}
		}
	
		public function call ($objectId1, $objectId2) {
			$update = Array('EASYRTC_OBJECT_ID'=>$objectId1, 'EASYRTC_CALLED_OBJECT_ID'=>$objectId2);
			$res = parent::updateRecords('USERS', $update, 'OBJECT_ID='.$_SESSION['ID']);
			
			
			$o2 = $this -> getRootObjectID($objectId2);
			
			$tmp = parent::getRecords('USERS', 'EASYRTC_ID', 'OBJECT_ID='.$o2);
			return $this->success($tmp[0]['EASYRTC_ID']);
			
		}
	
		public function callInfo ($easyRTCId) {
			$tmp = parent::getRecords('(USERS AS U JOIN OBJECTS AS O ON U.EASYRTC_OBJECT_ID = O.ID) JOIN ALIASES AS A ON O.ALIAS_ID=A.ID', 'O.ID as id, O.NAME as name, A.ALIAS as alias, U.EASYRTC_CALLED_OBJECT_ID as callTo', 'U.EASYRTC_ID=\''.$easyRTCId.'\'');
			return $this->success($tmp[0]);
		}
	
		public function callCheckIn ($easyRTCId) {
			$update = Array('EASYRTC_ID'=>'\''.$easyRTCId.'\'');
			$tmp = parent::updateRecords('USERS', $update, 'OBJECT_ID='.$_SESSION['ID']);
			return $this->success();
		}
	
	
		public function transfer ($fromId, $toId, $amount) {
			$tmp = parent::getRecords ('OBJECTS', 'ACCOUNT', 'ID='.$fromId);
			
			$res['account'] = floatval ($tmp[0]['ACCOUNT']);
			settype($amount, 'float');
			
			if ($amount > $res['account']) {
				return Array('status'=>false, 'err'=> Array ('type'=> 'userData', 'msg'=>'Amount can not be bigger than'.$rec['account']));
			}
			
			$update = Array('ACCOUNT'=>'ACCOUNT-'.$amount);
			$temp = parent::updateRecords('OBJECTS', $update, 'ID='.$fromId);
			
			$update = Array('ACCOUNT'=>'ACCOUNT+'.$amount);
			$temp = parent::updateRecords('OBJECTS', $update, 'ID='.$toId);
			
			$res['account'] -= $amount;
			
			return $this->success($res['account']);
			
		}
	
		public function vote ($toId, $fromId=0, $vote = 1) {
			$tmp = parent::getRecords('OBJECTS', 'REPUTATION', 'ID='.$toId);
            			
			$res = $this->getObject($tmp[0]); //json_decode($tmp[0]['REPUTATION'], true);
            
            $res['reputation'] = $res['REPUTATION'];            
            unset($res['REPUTATION']);
            unset($res['TAGS']);
			
			if ($vote < -1 || $vote > 1) return $res;
			
			$t = 0.95*atan(pow($res['reputation']->votes, 0.7))*2/pi();//0.0 - 0.95 - waga starych komentarzy
			$w = 1 - $t; //pocz�tkowa, pe�na waga nowego komentarza
			
			$temp = parent::getRecords('OBJECTS', 'REPUTATION', 'ID='.$fromId);
			
			$rep = json_decode($temp[0]['REPUTATION'], true);
			$rep = $this->getObject($rep[0]);
            
            $rep['reputation'] = $rep['REPUTATION'];            
            unset($rep['REPUTATION']);
            unset($rep['TAGS']);
			
			$rep = $rep['reputation'];
            
			$w *= (atan(log(1+$rep->votes))*2/pi()) * (($rep->avg+1)/2);
            
            var_dump((atan(log(1+$rep->votes))*2/pi()));
            var_dump((($rep->avg+1)/2));
                        			
			$res['reputation']->avg = (1-$w)*$res['reputation']->avg + $w*$vote;
			$res['reputation']->votes++;
			
			$update = Array ('REPUTATION'=>'\''.json_encode($res['reputation']).'\'');
			$res2 = parent::updateRecords('OBJECTS', $update, 'ID='.$toId);
			if ($res2['err']>0) return $this->databaseError($res2);
			
			return $this->success($res['reputation']);
		}
        
        public function void() {
            
            /* Dummy method which can serve router requests
             * returning empty array as a result to avoid api errors 
            */
            
            return $this->success(Array());
            
        }
	}
	
?>