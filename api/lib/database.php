<?php
	class database {
		public function init () {
			require_once ('dbConfig.php');
		}
		
		public function query ($tresc) {
			return mysql_query($tresc);
		}
		
		/* poni¿sza funkcja przyjmuje:
			$table - nazwa tabeli
			$record - rekord do dodania, ktory ma byæ tablic¹ asocjacyjn¹ postaci ("kolumna1"=>wartosc1, "kolumna2"=>wartosc2...)
			$debug - jeœli ustawione na true, wypisze siê treœæ ka¿dego zapytania i jego status
		*/
		
		public function addRecord ($table, $record, $debug=false) {
			$cols = '(';
			$values = '(';
			foreach ($record as $k=>$v) {
				$cols .= '`'.$k.'`,';
				$values .= '\''.$v.'\',';
			}
			$values = substr($values, 0, -1).')';
			$cols = substr($cols, 0, -1).')';
			
			$query = 'INSERT INTO `'.$table.'` '.$cols.' VALUES '.$values;
			database :: query ($query);
			
			
			if ($debug === true) {
				echo $query.' ... ';
				if (mysql_errno() > 0) echo mysql_error().'<br />';
				else echo 'OK<br />';
			}
			
			$res['err'] = mysql_errno();
			$res['errMsg'] = mysql_error();
			return $res;
		}
		 
		/* poni¿sza funkcja pobiera rekordy z bazy. 
			$where - warunek
			$additive - wszelkie dopiski do zapytania, np ORDER
			$debug = true wypisze treœæ zapytania i jego status. 
			
			Funkcja zwraca tablicê pobranych rekordów. Ka¿dy rekord jest tablic¹ asocjacyjn¹.
		*/
		
		public function getRecords ($table, $cols='*', $where='', $additive='', $debug=false) {
			$query = 'SELECT '.$cols.' FROM '.$table;
			if ($where != '') $query .= ' WHERE '.$where;
			if ($additive != '') $query .= ' '.$additive;
			
			$x = database :: query($query);
			if ($debug === true) {
				echo $query.' ... ';
				if (mysql_errno() > 0) echo mysql_error().'<br />';
				else echo 'OK<br />';
			}
			
			$res['err'] = mysql_errno();
			if ($res['err'] > 0) {
				$res['errMsg'] = mysql_error();
				return $res;
			}
			
			
			$res['records'] = Array ();
			$n = 0;
			for ($i=mysql_num_rows($x);$i>0;--$i) {
				$res['records'][$n] = mysql_fetch_assoc($x);
				++$n;
			}
			return $res;
		}
		
		public function removeRecords ($table, $where, $debug=false) {
			database::query('DELETE FROM `'.$table.'` WHERE '.$where);
			return Array('err'=> mysql_errno());
		}
		
		public function updateRecords ($table, $set, $where='', $debug=false) {
			$query = 'UPDATE `'.$table.'` SET ';
			foreach ($set as $col=>$val) $query .= '`'.$col.'`='.$val.',';
			$query = substr ($query, 0, -1);//usuwamy ostatni przecinek
			if ($where!='') $query .= ' WHERE '.$where;
			
			database::query($query);
			
			if ($debug === true) {
				echo $query.' ... ';
				if (mysql_errno() > 0) echo mysql_error().'<br />';
				else echo 'OK<br />';
			}
			
			if (mysql_errno() > 0)
				return Array ('err'=> mysql_errno(), 'errMsg'=>mysql_error());
			else 
				return Array ('err'=> mysql_errno());
		}
		
		public function insertId () {
			return mysql_insert_id();
		}
		
		public function errMes () {
			return mysql_error();
		}			
	}
?>