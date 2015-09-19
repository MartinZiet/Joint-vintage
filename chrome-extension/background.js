var JointContextMenu = new Object;

JointContextMenu.init = function() {
	var fn = function(structure) {
		JointContextMenu.create(structure);	
	}
	JointAPI.request('/objects',false,fn);
}

JointContextMenu.getChildrenObjects = function(objects,parent_id) {
	
	var chList = [];
	
	for(var i=0; i < objects.length; i++) {
		if(objects[i].parent_id==parent_id) {
			objects[i].children = JointContextMenu.getChildrenObjects(objects,objects[i].id);
			chList.push(objects[i]);
		}
	}
	
	return chList;
	
}

JointContextMenu.create = function(objects) {
	var tree = JointContextMenu.getChildrenObjects(objects,0);
	console.log(tree);
	
	var main = chrome.contextMenus.create({
		title: 'Add to Joint',
		contexts: ["all"]
	});
	
	JointContextMenu.createSub(tree,main);
}

JointContextMenu.createSub = function(objects,parent) {
	for(var i=0; i < objects.length; i++) {
		var sub = chrome.contextMenus.create({
			parentId: parent,
			title: objects[i].name,
			contexts: ["all"],
			onclick: JointContextMenu.bindClickFn(objects[i])
		});
		if(objects[i].children.length>0) {
			var r = chrome.contextMenus.create({
				parentId: sub,
				title: objects[i].name,
				contexts: ["all"],
				onclick: JointContextMenu.bindClickFn(objects[i])
			});
			var s = chrome.contextMenus.create({
				parentId: sub,
				type: "separator",
				contexts: ["all"]
			});
			JointContextMenu.createSub(objects[i].children,sub);
		}
	}
}

JointContextMenu.saveContent = function(obj,html,url) {
	var data = {
		content_html: html,
		content_url: url
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
    		JointContextMenu.saveContent(obj,resp,response.url);
  		});
	});
}

JointContextMenu.init();