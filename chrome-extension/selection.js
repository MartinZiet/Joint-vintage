chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
                
    if (request == "getHtmlSelection") {
    
    	var selection = window.getSelection();
		// Only works with a single range 
		var range = selection.getRangeAt(0);
		var container = range.commonAncestorContainer;
		
		var payload = {
		  'text': selection.toString(),
		  'html': container.innerHTML,
		  'selection': selection,
		  'url': document.location.href
		};
		
		sendResponse(payload);
    	
    }
});