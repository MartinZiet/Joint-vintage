<?php

	class objectMatch {
		/* ta klasa s�u�y do sprawdzania, czy dwa obiekty szukaj�ce do siebie pasuj�
		z tej klasy na zewn�trz wystarczy u�ywac metody match, kt�ra zwraca odpowiednio true/false
		zmienne $o1 i $o2 powinny by� przekazane jako tablice socjacyjne zawieraj�ce pola "ID", "PARENT_ID" oraz "TAGS".
		"TAGS" powinien by� JSON-owym STRINGIEM odpowiadaj�cym temu, co dany obiekt chce i oferuje
		*/
		
		private function point_match ($chce, $oferuje) {		    		    
			//geograficzne
			if (isset($chce -> lat)) {
				//echo PHP_EOL.$chce->address.' > '.$oferuje->address.PHP_EOL;
				//var_dump($chce);
				//var_dump($oferuje);
				//echo 'match '.$chce->lat.','.$chce->lng.','.$chce->radius.' <> '.$oferuje->lat.','.$oferuje->lng.','.$oferuje->radius.PHP_EOL;
				if (distance(Array($chce->lat,$chce->lng), Array($oferuje->lat,$oferuje->lng)) 
				<= floatval($chce ->radius)+floatval($oferuje ->radius)) {
					//echo 'MATCHED';
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
			//return true;	
			if ((bool)$chce -> all === true) {
				if ((bool)$chce -> block === true) {
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
			if ($chce == NULL || $oferuje == NULL) { return false; }
			foreach ($chce as $nazwa=>$wartosc) {
				//brak odpowiedniego pola w oferowanym
				if (!isset ($oferuje->$nazwa)) {
					return false;
				}
				if (objectMatch::main_match ($wartosc, $oferuje->$nazwa) == false) {
					//echo 'false main_match';
					return false;
				}
			}
			return true;
		}
			
		public function match ($o1, $o2) {
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
			
			//echo $o1['NAME'].' vs '.$o2['NAME'].PHP_EOL;
			
			$o1 = json_decode ($o1['TAGS']);
			$o2 = json_decode ($o2['TAGS']);      
			
			if (($o1 === false) || ($o2 === false)) {
				return false;
			}
			
			$result1 = $this->chce_oferuje ($o1->wants, $o2->offers);
			$result2 = $this->chce_oferuje ($o2->wants, $o1->offers);
			$result = ($result1 && $result2);
			
			//var_dump($result1);
			//var_dump($result2);
			//var_dump($result);
			
			return $result;
		}
	}

?>
	