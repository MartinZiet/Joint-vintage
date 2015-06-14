<?php

	class objectMatch {
		/* ta klasa s�u�y do sprawdzania, czy dwa obiekty szukaj�ce do siebie pasuj�
		z tej klasy na zewn�trz wystarczy u�ywac metody match, kt�ra zwraca odpowiednio true/false
		zmienne $o1 i $o2 powinny by� przekazane jako tablice socjacyjne zawieraj�ce pola "ID", "PARENT_ID" oraz "TAGS".
		"TAGS" powinien by� JSON-owym STRINGIEM odpowiadaj�cym temu, co dany obiekt chce i oferuje
		*/
		
		private function point_match ($chce, $oferuje) {
		    $this->debugMsg('point_match');		    		    
			//geograficzne
			if (isset($chce -> lat)) {
				//echo PHP_EOL.$chce->address.' > '.$oferuje->address.PHP_EOL;
				//var_dump($chce);
				//var_dump($oferuje);
				//echo 'match '.$chce->lat.','.$chce->lng.','.$chce->radius.' <> '.$oferuje->lat.','.$oferuje->lng.','.$oferuje->radius.PHP_EOL;
				if (distance(Array($chce->lat,$chce->lng), Array($oferuje->lat,$oferuje->lng)) 
				<= floatval($chce ->radius)+floatval($oferuje ->radius)) {
					$this->debugMsg('Localization matched '.$chce->address.' with '.$oferuje->address);
					return true;
				} else {
					return false;
				}
			}
			//przedzia�y			
			if (isset($chce -> from)) {			    			    
				if (floatval($chce -> from) > floatval($oferuje -> to) || floatval($chce -> to) < floatval($oferuje -> from) ) return false;
			}
			
			//zawarto��
			return ($chce -> value === $oferuje -> value);
		}
		
		private function main_match ($chce, $oferuje) {
			$this->debugMsg('main_match');
			if ((bool)$chce -> all === true) {
			    $this->debugMsg('main_match chce->all');
				if ((bool)$chce -> block === true) {
				    $this->debugMsg('main_match chce->block');
					$n = count ($chce -> points);
					$i = 0;
					foreach ($oferuje->points as $pkt2) {
						if ($this->point_match ($chce -> points[$i], $pkt2) == true ) {
							++$i;
							if ($i >= $n) { return true; }
						}
						else {
							if ($this->point_match ($chce -> points[0], $pkt2) == true ) $i = 1;
							else $i = 0;					
						}
					}
					return false;
				}
				else {
					if ((bool)$chce -> order === true) {
						$n = count($chce->points);
						$i = 0;
					
						foreach ($oferuje -> points as $pkt2) {
							if ($this->point_match ($chce -> points[$i], $pkt2) === true ) {
								++$i;
								if ($i >= $n) return true;
							}
						}
						return false;
					}
					else {
						foreach ($chce -> points as $pkt) {
							$pom = false;
							foreach ($oferuje -> points as $pkt2) {
								if ($this->point_match ($pkt, $pkt2) == true) {
									$pom = true;
									break;
								}
							}
							if ($pom == false) return false;
						}
						return true;
					}
				}
			}
			else {
				if((count($chce->points) + count($oferuje->points)) < 1) {
					return true;
				}			    			    
				foreach ($chce -> points as $pkt) {
					foreach ($oferuje -> points as $pkt2) {					    					    
						if ($this->point_match ($pkt, $pkt2) === true) return true;
					}
				}
				return false;
			}
		}
		
		private function chce_oferuje ($chce, $oferuje) {
		    if($oferuje == NULL || $chce == NULL) {
		        return false;
		    }			
			foreach ($chce as $nazwa=>$wartosc) {
				//brak odpowiedniego pola w oferowanym
				if (!isset ($oferuje->$nazwa)) {				    
				    $this->debugMsg('Brak pola w oferowanym ('.$nazwa.')');
					return false;
				}
				if ($this->main_match ($wartosc, $oferuje->$nazwa) == false) {
					$this->debugMsg('False w main_match '.$nazwa);
					return false;
				}
			}
			return true;
		}
        
        private function debugMsg($msg) {
            if($this->_debug) {
                echo $msg.PHP_EOL;
            }
        }
			
		public function match ($o1, $o2) {
		    
            $this->_debug = false;
            
			//znajdujemy rodzic�w
			$p1 = $o1;
			while ($p1['PARENT_ID']>0) {
				$p1 = database :: getRecords ('OBJECTS', '*', 'ID='.$p1['PARENT_ID']);
				$p1 = $p1[0];
			}
			$p2 = $o2;
			while ($p2['PARENT_ID']>0) {
				$p2 = database :: getRecords ('OBJECTS', '*', 'ID='.$p2['PARENT_ID']);
				$p2 = $p2[0];
			}
		
			if ($p1['ID']==$p2['ID']) return false;
            
            
            if($o1['ID']==$_GET['test-match-with']) { $debugMode = true; }
			
            if($debugMode) {
             $this->_debug = true;
			 echo $o1['ID'].':'.$o1['NAME'].' vs '.$o2['ID'].':'.$o2['NAME'].PHP_EOL.PHP_EOL;
                $o1info = $o1;
                $o2info = $o2;
            }
			
			$o1 = json_decode ($o1['TAGS']);
			$o2 = json_decode ($o2['TAGS']);      
			
			if (($o1 === false) || ($o2 === false)) {
				return false;
			}
            
            $getTemplateId = function($objTags) {                
                return $objTags->_meta->_template_id->points[0]->value;
            };
            
            $templateMatched = ($getTemplateId($o1) == $getTemplateId($o2));
			
            if($templateMatched) {                 
                 
                $result1 = $this->chce_oferuje ($o2->wants, $o1->offers);                 
		        $result2 = $this->chce_oferuje ($o1->offers, $o2->wants);
                
                if(!$o1->wants) { $result1 = $result2 = $this->chce_oferuje($o2->wants,$o1->offers); }
                if(!$o2->wants) { $result1 = $result2 = $this->chce_oferuje($o1->wants,$o2->offers); }
                 
            }
			$result = ($templateMatched && $result1 && $result2);
			
            if($debugMode) {
             if(!$templateMatched) {
                 echo 'NOT MATCHED: Different template'.PHP_EOL;
             } else {
                 echo 'MATCHED: Same template'.PHP_EOL;
             }             
             echo $o1info['NAME'].' tags:'.PHP_EOL;
             echo json_encode($o1).PHP_EOL.PHP_EOL;
             echo $o2info['NAME'].' tags:'.PHP_EOL;
             echo json_encode($o2).PHP_EOL.PHP_EOL;
			 echo 'chce_oferuje('.$o1info['ID'].'->offers,'.$o2info['ID'].'->wants): '.((int)$result1).PHP_EOL;
             echo 'chce_oferuje('.$o2info['ID'].'->wants,'.$o1info['ID'].'->offers): '.((int)$result2).PHP_EOL;
             echo PHP_EOL;
            }
			
			return $result;
		}
	}
