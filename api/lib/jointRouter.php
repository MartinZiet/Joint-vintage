<?php
	class jointRouter {
		
		public function __construct () {
			$this -> model = new JointModel ();
			$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
			switch ($_GET['REQUEST_METHOD']) {
				case 'GET':
					echo json_encode ($this -> restGet($request));
					break;
				case 'POST': 
					echo json_encode ($this -> restPost($request));
					break;
				case 'PUT': 
					echo json_encode ($this -> restPut($request));
					break;
				case 'DELETE': 
					echo json_encode ($this -> restDelete($request));
					break;
				default:
					$this -> restError ($request);
			}
		}
		
		private function restPost ($request) {
			switch ($request[0]) {
				case 'objects': //tworzy nowy obiekt
					return ( $this->model->addObject ($request[1], $_POST['name'], $_POST['public'], $_POST['type'], $_POST['tags'], $request[2]) );
				case 'users': //tworzy nowego usera
					return ( $this->model->addUser ($_POST['login'], $_POST['name'], $_POST['password']) );
				case 'chat' :
					return $this->model->chat ($request[1], $request[2], $_POST['message']);
				case 'aliases' :
					return $this->model->addAlias ($request[1], $_POST['aliasName']);
				case 'contents' :
					return $this->model->addContent ($request[1], $_POST['HTML']);
				case 'friendship' :
					return $this -> model -> addFriendship ($request[1],$request[2]);
			}		
		}
		
		private function restGet ($request) {
			$_DATA = $_GET;
			switch ($request[0]) {
				case 'chat':
					return $this->model->chat ($request[1], $request[2]);
				case 'aliases' :
					return $this->model->getAliases ($request[1]);
				case 'objects' :
					return $this->model->structure ($request[1], ($request[2]=="true"?true:false));
				case 'friends' :
					return $this -> model -> friendList ($request[1]);
				case 'votes' :
					return $this -> model -> vote ($request[1]);
			}
		}
		
		private function restDelete ($request) {
			$_DATA = $_POST;
			switch ($request[0]) {
				case 'aliases':
					return $this->model->removeAlias ($request[1], $request[2]);
				case 'objects':
					return $this -> model -> removeObject($request[1]);
				case 'friendship':
					return $this -> model -> removeFriendship ($request[1], $request[2]);
				
			}
		}
		
		private function restPut ($request) {
			$_DATA = $_POST;
			switch ($request[0]) {
				case 'aliases':
					return $this -> model -> changeAlias ($request[1], $request[2], ($request[3]=='true'?true:false));
				case 'objects' :
					return $this -> model -> moveObject ($request[1], $request[2]);
				case 'contents' :
					return $this -> model -> updateContent ($request[1], $_DATA['newContentJSONText']);
				case 'transfers' :
					return $this -> model -> transfer ($request[1], $request[2], $request[3]);
				case 'votes' :
					return $this -> model -> vote ($request[1], $request[2], $request[3]);
			}
		}
	
		private function restError ($request) {
			echo "hihihi";
		}
	}
	
?>