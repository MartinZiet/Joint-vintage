var JointAPI = new Object;

JointAPI._url = 'http://s18367520.onlinehome-server.info/devel/Joint/api/api.php';

JointAPI.request = function(path,data,callback,method) {
	
	if(!method) { var method = 'GET'; }
	
	var url = this._url + path;
	
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var response = JSON.parse(xhr.responseText);
			if(!response.status) {
				alert(response.error.msg);
			} else {
				callback.call(xhr,response.data);
			}
		}
	}; // Implemented elsewhere.
	
	var serialize = function(obj, prefix) {
	  var str = [];
	  for(var p in obj) {
	    if (obj.hasOwnProperty(p)) {
	      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
	      str.push(typeof v == "object" ?
	        serialize(v, k) :
	        encodeURIComponent(k) + "=" + encodeURIComponent(v));
	    }
	  }
	  return str.join("&");
	}
	
	xhr.send(serialize(data));
	
}