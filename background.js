var pendingNotifications = {};

var createNotification = function() {
    var i = 0;
    chrome.notifications.create(i.toString(), {
        type: 'basic',
        iconUrl: 'ghost.png',
        title: 'Don\'t forget!',
        message: 'You have things to do. Wake up, dude!',
        isClickable: false
     }, function(notificationId) {
        console.log("MEOW");
        console.log(notificationId);

        });
}


createNotification();
chrome.notifications.onClosed.addListener(function(notifId, byUser){
    console.log(notifId);
    //createNotification(); //UNCOMMENT THIS IF YOU WANT UNLIMITED NOTIFICATION FUN
})

