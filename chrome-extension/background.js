var JointContextMenu = new Object;

JointContextMenu.init = function() {
	var fn = function(structure) {
		JointContextMenu.create(structure);	
	}
	JointAPI.request('/objects',false,fn);
}

JointContextMenu.create = function(objects) {
	var main = chrome.contextMenus.create({
		title: 'Add to Joint',
		contexts: ["all"]
	});
	
	for(var i=0; i < objects.length; i++) {
		chrome.contextMenus.create({
			parentId: main,
			title: objects[i].name,
			contexts: ["all"],
			onclick: JointContextMenu.bindClickFn(objects[i])
		});
	}
}

JointContextMenu.saveContent = function(obj,html) {
	var data = {
		content_html: html
	};
	var path = '/objects/' + obj.id + '/import';
	var fn = function(response) {
		console.log(response);
	}
	JointAPI.request(path,data,fn,'POST');
}

JointContextMenu.bindClickFn = function(obj) {
	var fn = function() {
		JointContextMenu.clickFn(obj);
	}
	return fn;
}

JointContextMenu.clickFn = function(obj) {
	JointContextMenu.querySelection(obj);
}

JointContextMenu.querySelection = function(obj) {
	var obj = obj;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		chrome.tabs.sendMessage(tabs[0].id, 'getHtmlSelection', function(response) {
  			var resp = response.html;
  			if(!resp) { resp = response.text; }
    		JointContextMenu.saveContent(obj,resp);
  		});
	});
}

JointContextMenu.init();