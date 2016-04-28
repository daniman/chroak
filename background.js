var notificationBool = false;
var fontBool = false;
var powerBool = false;
var closeBool = false;

var createNotification = function() {
    chrome.notifications.create('chroak', {
        type: 'basic',
        iconUrl: 'frog.png',
        title: 'Hey You!',
        message: 'This can be made to bug you forever!',
        isClickable: false
     }, function(notificationId) {});
}

chrome.notifications.onClosed.addListener(function(notifId, byUser){
  if (notificationBool) {
    createNotification();
  }
});

/*
 * Dos Chrome -- Close windows and tabs as soon as they open.
 */
console.log('background process running');
chrome.windows.onCreated.addListener(function(event) {
  console.log('opened a new window');
  if (closeBool) {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        chrome.tabs.remove(tab.id);
      });
    });
  }
});

chrome.tabs.onCreated.addListener(function(event) {
  console.log('opened a new tab');
  if (closeBool) {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        chrome.tabs.remove(tab.id);
      });
    });
  }
});