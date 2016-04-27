var notificationBool = false;

var createNotification = function() {
    chrome.notifications.create('chroak', {
        type: 'basic',
        iconUrl: 'ghost.png',
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
