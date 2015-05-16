<?php

	abstract class objectMatch {
		/* ta klasa s³u¿y do sprawdzania, czy dwa obiekty szukaj¹ce do siebie pasuj¹
		z tej klasy na zewn¹trz wystarczy u¿ywac metody match, która zwraca odpowiednio true/false
		zmienne $o1 i $o2 powinny byæ przekazane jako tablice socjacyjne zawieraj¹ce pola "ID", "PARENT_ID" oraz "TAGS".
		"TAGS" powinien byæ JSON-owym STRINGIEM odpowiadaj¹cym temu, co dany obiekt chce i oferuje
		*/
		
		private function point_match ($chce, $oferuje) {
			//geograficzne
			if (isset($chce -> LatLng)) {
				if (distance(explode(',', $chce -> LatLng), explode(',',$oferuje -> LatLng)) <= floatval($chce -> R)+floatval($oferuje -> R)) return true;
				else return false;
			}
			//przedzia³y
			if (isset($chce -> od)) {
				if (floatval($chce -> from) > floatval($oferuje -> to) || floatval($chce -> to) < floatval($oferuje -> from) ) return false;
			}
			
			//zawartoœæ
			return ($chce -> value === $oferuje -> value);
		}
		
		private function main_match ($chce, $oferuje) {
			return true;
			if ($chce -> all === true) {
				if ($chce -> block === true) {
					$n = count ($chce -> points);
					$i = 0;
					
					foreach ($oferuje->points as $pkt2) {
						if (objectMatch::point_match ($chce -> points[$i], $pkt2) == true ) {
							++$i;
							if ($i >= $n) return true;
						}
						else {
							if (objectMatch::point_match ($chce -> points[0], $pkt2) == true ) $i = 1;
							else $i = 0;					
						}
					}
					return false;
				}
				else {
					if ($chce -> order === true) {
						$n = count($chce->points);
						$i = 0;
						
						foreach ($oferuje -> points as $pkt2) {
							if (point_match ($chce -> points[$i], $pkt2) === true ) {
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
								if (point_match ($pkt, $pkt2) == true) {
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
				foreach ($chce -> points as $pkt) {
					foreach ($oferuje -> points as $pkt2) {
						if (point_match ($pkt, $pkt2) === true) return true;
					}
				}
				return false;
			}
		}
		
		private function chce_oferuje ($chce, $oferuje) {
			if ($chce == NULL || $oferuje == NULL) return false;
			foreach ($chce as $nazwa=>$wartosc) {
				//brak odpowiedniego pola w oferowanym
				if (!isset ($oferuje->$nazwa)) {
					return false;
				}
				if (objectMatch::main_match ($wartosc, $oferuje->$nazwa) == false) return false;
			}
			return true;
		}
			
		public function match ($o1, $o2) {	
			//znajdujemy rodziców
			$p1 = $o1;
			while ($p1['PARENT_ID']!=$p1['ID']) {
				$p1 = database :: getRecords ('OBJECTS', '*', 'ID='.$p1['PARENT_ID']);
				$p1 = $p1[0];
			}
			$p2 = $o2;
			while ($p2['PARENT_ID']!=$p2['ID']) {
				$p2 = database :: getRecords ('OBJECTS', '*', 'ID='.$p2['PARENT_ID']);
				$p2 = $p2[0];
			}
		
			if ($p1['ID']==$p2['ID']) return false;
			
			$o1 = json_decode ($o1['TAGS']);
			$o2 = json_decode ($o2['TAGS']);
			
			if (($o1 === false) || ($o2 === false)) {
				return false;
			}
			return (objectMatch :: chce_oferuje ($o1->wants, $o2->offers) && objectMatch :: chce_oferuje ($o2->wants, $o1->offers));
		}
	}

?>
	