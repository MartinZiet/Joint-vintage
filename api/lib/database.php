<?php
	class databaseException extends Exception {
		public function __construct($message = "", $code = 0, Exception $previous = null) {
			parent::__construct($message, $code, $previous);
		}
	}

	class database {
		public function init () {
			require_once ('dbConfig.php');
		}
		
		public function query ($tresc) {
			$tmp = mysql_query($tresc);
			if (mysql_errno() > 0) {
				throw new databaseException(mysql_error().' while doing: '.$tresc, mysql_errno());
			}
			else
				return $tmp;
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
			return true;
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
			$res = Array ();
			$n = 0;
			for ($i=mysql_num_rows($x);$i>0;--$i) {
				$res[$n] = mysql_fetch_assoc($x);
				++$n;
			}
			return $res;
		}
		
		public function removeRecords ($table, $where, $debug=false) {
			database::query('DELETE FROM `'.$table.'` WHERE '.$where);
			return true;
		}
		
		public function updateRecords ($table, $set, $where='', $debug=false) {
			$query = 'UPDATE `'.$table.'` SET ';
			foreach ($set as $col=>$val) $query .= '`'.$col.'`='.$val.',';
			$query = substr ($query, 0, -1);//usuwamy ostatni przecinek
			if ($where!='') $query .= ' WHERE '.$where;
			
			database::query($query);
			
			return true;
		}
		
		public function insertId () {
			return mysql_insert_id();
		}		
	}
?>