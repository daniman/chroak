var createNotification = function() {
    chrome.notifications.create('chroak', {
        type: 'basic',
        iconUrl: 'ghost.png',
        title: 'Hey You!',
        message: 'This can be made to bug you forever!',
        isClickable: false
     }, function(notificationId) {});
}

// createNotification();
chrome.notifications.onClosed.addListener(function(notifId, byUser){
    // createNotification(); //UNCOMMENT THIS IF YOU WANT UNLIMITED NOTIFICATION FUN
})

