
/*
If the user clicks on an element which has the class "ua-choice":
* fetch the element's textContent: for example, "IE 11"
* pass it into the background page's setUaString() function
*/
console.log(chrome.cookies);

 $( document ).ready(function() {

   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
      //console.log(currentTab);
		chrome.cookies.getAll({"url":currentTab.url},function(cks){
			for (var i = cks.length - 1; i >= 0; i--) {

				console.log("A cookie:");
				console.log(cks[i]);

				var template = $("#cookie_template").html();
				template = template.replace("{{ID}}",i);
				template = template.replace("{{NAME}}",cks[i].name);
				template = template.replace("{{VALUE}}",cks[i].value);
				template = template.replace("{{DOMAIN}}",cks[i].domain);
				template = template.replace("{{PATH}}",cks[i].path);
				template = template.replace("{{EXPIRE}}",cks[i].expirationDate);
				$("#cookies").append(template);

			}
			
		});
    }

  }); 
   console.log( "ready!" );
});


$(document).on('submit', '.cookie_form', function(e){ 
    e.preventDefault();

    var cookieID = this.id;
    var cname = $("#"+cookieID+" h2[name=name]").text();
    var cdomain = $("#"+cookieID+" input[name=domain]").val();
    var cpath = $("#"+cookieID+" input[name=path]").val();
    var cvalue = $("#"+cookieID+" input[name=value]").val();

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
			currentTab = tabs[0];
		}
	});


//chrome.cookies.remove({"url": "http://localhost:8000/labs/session_example/session_example.php", "name": "session_example_cookie"}, function(deleted_cookie) { console.log(deleted_cookie); });

var cookieData = {
    name: cname,
    value: cvalue,
    path: cpath,
    //domain: cdomain,
    url: currentTab.url,
    expirationDate: 1461130896
};

chrome.cookies.set(cookieData, onSet);
	
	}); 


function onSet(cookie) {
  if (chrome.runtime.LastError) {
    console.error(chrome.runtime.LastError);
  } else {
    console.log("Cookie set");
    console.log(cookie);
    console.log("^^^^^^^^");
  }
}