var createNotification = function() {
    chrome.notifications.create('chroak', {
        type: 'basic',
        iconUrl: 'frog.png',
        title: 'Hey You!',
        message: 'This can be made to bug you forever!',
        isClickable: false
     }, function(notificationId) {});
}

if (JSON.parse(localStorage.getItem('notificationBool'))) {
  createNotification();
}
chrome.notifications.onClosed.addListener(function(notifId, byUser){
  if (JSON.parse(localStorage.getItem('notificationBool'))) {
    createNotification();
  }
});

/*
 * Dos Chrome -- Close windows and tabs as soon as they open.
 * Reroute all new windows and tabs to an arbitrary website.
 */
chrome.windows.onCreated.addListener(function(event) {
  console.log('opened a new window');
  if (JSON.parse(localStorage.getItem('rerouteBool'))) {
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
  if (JSON.parse(localStorage.getItem('rerouteBool'))) {
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