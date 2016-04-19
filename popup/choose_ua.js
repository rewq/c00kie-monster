
/*
If the user clicks on an element which has the class "ua-choice":
* fetch the element's textContent: for example, "IE 11"
* pass it into the background page's setUaString() function
*/
console.log(chrome.cookies);

$( document ).ready(function() { // Document Ready

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
		  currentTab = tabs[0];
		  //console.log(currentTab);
			chrome.cookies.getAll({"url":currentTab.url},function(cks){
				for (var i = cks.length - 1; i >= 0; i--) {
					var template = $("#cookie_template").html();
					template = template.replace("{{ID}}",i);
					template = template.replace("{{NAME}}",cks[i].name);
					template = template.replace("{{VALUE}}",cks[i].value);
					template = template.replace("{{DOMAIN}}",cks[i].domain);
					template = template.replace("{{PATH}}",cks[i].path);
					template = template.replace("{{EXPIRE}}",cks[i].expirationDate);
					template = template.replace("{{SECURE}}",(cks[i].secure ? "checked" : ""));
					template = template.replace("{{SESSION}}",(cks[i].session ? "checked" : ""));
					template = template.replace("{{HTTPONLY}}",(cks[i].httpOnly ? "checked" : ""));
					template = template.replace("{{HOSTONLY}}",(cks[i].hostOnly ? "checked" : ""));
					$("#cookies").append(template);
				}	
			});
		}
	}); 
}); // End Document Ready


$(document).on('submit', '.cookie_form', function(e){ // Fired when a form is submitted
    e.preventDefault(); // Disable the form from actually submitting

    var cookieID = this.id; // Cookie ID is the form ID
    // Scraping inputs by name
    var cname = $("#"+cookieID+" h2[name=name]").text();
    var cdomain = $("#"+cookieID+" input[name=domain]").val();
    var cpath = $("#"+cookieID+" input[name=path]").val();
    var cvalue = $("#"+cookieID+" input[name=value]").val();
    var cexpire = $("#"+cookieID+" input[name=expire]").val();
    // Scraping checkboxes
    var csession = $("#"+cookieID+" input[name=session]").is(':checked');
    var csecure = $("#"+cookieID+" input[name=secure]").is(':checked');
    var chttpOnly = $("#"+cookieID+" input[name=httpOnly]").is(':checked');
    var chostOnly = $("#"+cookieID+" input[name=hostOnly]").is(':checked');

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
			currentTab = tabs[0];
		}
	});


	//chrome.cookies.remove({"url": "http://localhost:8000/labs/session_example/session_example.php", "name": "session_example_cookie"}, function(deleted_cookie) { console.log(deleted_cookie); });

	var expireDate = parseFloat(cexpire);

	var cookieData = {
	    name: cname,
	    value: cvalue,
	    path: cpath,
	    url: currentTab.url,
	    secure: csecure,
	    httpOnly: chttpOnly
	};

	if (!chostOnly) {
		cookieData.domain = cdomain;
	} 
	if (!csession) {
		cookieData.expirationDate = expireDate;
	} 

	chrome.cookies.set(cookieData);
	
}); // End Form Submit