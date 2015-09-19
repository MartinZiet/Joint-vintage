var JointLogin = new Object;

JointLogin.check = function() {
	var fn = function(data) {
		if(!data.object_id) {
			document.getElementById('login-form').style.display = 'block';
			document.getElementById('login-status').style.display = 'none';
		} else {
			document.getElementById('login-form').style.display = 'none';
			document.getElementById('login-status').style.display = 'block';
		}
	}
	JointAPI.request('/session',false,fn);
}

JointLogin.login = function() {
	
	var username = document.getElementById('login-username').value;
	var password = document.getElementById('login-password').value;
	
	var data = {
		username: username,
		password: password
	};
	
	var fn = function() {
		JointLogin.check();
	}
	
	JointAPI.request('/login',data,fn,'POST');
	
}


window.onload = function() {
	
	document.getElementById('login-form').style.display = 'block';
	document.getElementById('login-status').style.display = 'none';

	document.getElementById('login-button').onclick = function() {
		JointLogin.login();
		return false;
	}
	
	document.getElementById('login-link').onclick = function() {
		window.open('http://s18367520.onlinehome-server.info/devel/Joint/gui/');
		return false;
	}
	
	JointLogin.check();

}