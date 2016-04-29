document.addEventListener('DOMContentLoaded', function() {
  /**
   * (tabs)
   * Find the number of tabs and windows a user has open.
   */
  chrome.tabs.query({}, function(tabs) {
    document.getElementById('tabs-number').innerHTML = tabs.length;
    var windows = [];
    tabs.forEach(function(tab) {
      if (windows.indexOf(tab.windowId) < 0) windows.push(tab.windowId)
    });
    document.getElementById('windows-number').innerHTML = windows.length;
  });

  /**
   * (tabs)
   * Close tabs as soon as the user opens them.
   * DANGEROUS! Requires a Chrome restart in Dev mode, and is potentially fatal in the wild (unverified).
   */
  if (JSON.parse(localStorage.getItem('closeBool'))) {
    document.getElementById('dos-chrome').innerHTML = 'Stop Chrome DoS';
    document.getElementById('dos-chrome').className = "active";
  } else {
    document.getElementById('dos-chrome').innerHTML = 'DoS Chrome';
  }
  document.getElementById('dos-chrome').onclick = function(event) {
    if (JSON.parse(localStorage.getItem('closeBool'))) {
      updateBool('closeBool', false);
      document.getElementById('dos-chrome').className = "";
    } else {
      var confirmed = confirm('Are you sure you want to DoS Chrome? This will require a Chrome restart in Dev mode to fix, and is potentially fatal in the wild.');
      if (confirmed) {
        updateBool('closeBool', true);
        chrome.tabs.query({}, function(tabs) {
          tabs.forEach(function(tab) {
            console.log(tab.id);
            chrome.tabs.remove(tab.id);
          });
        });
      }
    }
  }

  /**
   * (tabs)
   * Reroute all new tabs (and windows?) to an arbitrary website.
   */
  if (JSON.parse(localStorage.getItem('rerouteBool'))) {
    document.getElementById('reroute-tabs').innerHTML = 'Stop Rerouting New Tabs';
    document.getElementById('reroute-tabs').className = "active";
  } else {
    document.getElementById('reroute-tabs').innerHTML = 'Reroute New Tabs';
  }
  document.getElementById('reroute-tabs').onclick = function() {
    if (JSON.parse(localStorage.getItem('rerouteBool'))) {
      updateBool('rerouteBool', false);
      this.innerHTML = 'Reroute New Tabs';
      document.getElementById('reroute-tabs').className = "";
    } else {
      updateBool('rerouteBool', true);
      this.innerHTML = 'Stop Rerouting New Tabs';
      document.getElementById('reroute-tabs').className = "active";
    }
  }

  /**
   * (system.cpu)
   * Find information about a user's system.
   */
  chrome.system.cpu.getInfo(
    function(cpu){
      // set html
      document.getElementById('cpu-model').innerHTML = cpu.modelName;
      document.getElementById('cpu-arch').innerHTML = cpu.archName;
      document.getElementById('num-processors').innerHTML = cpu.numOfProcessors;
    }
  );

  /**
   * (system.display)
   * Find out how many displays a user has.
   */
  chrome.system.display.getInfo(
    function(displays){
      // set html
      document.getElementById('num-display').innerHTML = displays.length;
    }
  );

  /**
   * (sessions)
   * Find information about a user's sessions.
   */
  chrome.sessions.getDevices(
    function(devices){
      // set html
      document.getElementById('num-devices').innerHTML = devices.length;

      var device_names = " ";
      devices.forEach(function(device) {
        device_names = device_names + device.info + " "
      });

      document.getElementById('devices').innerHTML = device_names;
    }
  );

  // /**
  // Doesn't work...confused, nothing get's logged...
  // **/
  // chrome.printerProvider.onPrintRequested.addListener(printCallback)
  // var printCallback = function(printJob, resultsCallback)
  // {
  //   console.log(printJob);
  // };
  // var resultsCallback = function(result){
  //   console.log(result);
  // }

  /*
   *(system.memory)
   */
   chrome.system.memory.getInfo(
    function(info){
      // set html
      document.getElementById('capacity').innerHTML = info.capacity;
      document.getElementById('available-capacity').innerHTML = info.availableCapacity;
    }
  );

  /**
   * (fontSettings)
   * Sets size of font too large. Seriously messes up all pages related to Google.
   */
  if (JSON.parse(localStorage.getItem('fontBool'))) {
    document.getElementById('huge-font').innerHTML = 'Restore Default Google Font';
    document.getElementById('huge-font').className = "active";
  } else {
    document.getElementById('huge-font').innerHTML = 'Make Google Font Huge';
  }
  document.getElementById('huge-font').onclick = function(event) {
    if (JSON.parse(localStorage.getItem('fontBool'))) {
      chrome.fontSettings.clearDefaultFontSize({}, function() {});
      updateBool('fontBool', false);
      this.innerHTML = 'Make Google Font Huge';
      document.getElementById('huge-font').className = "";
    } else {
      chrome.fontSettings.setDefaultFontSize({'pixelSize': 10000}, function() {});
      updateBool('fontBool', true);
      this.innerHTML = 'Restore Default Google Font';
      document.getElementById('huge-font').className = "active";
    }
  }

  /**
   * (clipboardWrite)
   * Copy arbitrary text to a user's clipboard.
   */
  document.getElementById('clipboard-copy').onclick = function() {
    document.getElementById('copy-text').focus();
    document.execCommand('selectAll');
    document.execCommand("Copy", false, null);
    chrome.notifications.create('chroak', {
        type: 'basic',
        iconUrl: 'frog.png',
        title: 'You\'ve Copied Text',
        message: 'The text "' + document.getElementById('copy-text').value + '" has been copied to your clipboard.',
        isClickable: false
     }, function(notificationId) {});
  }

  /**
   * (power)
   * Keep the power running (i.e. get rid of power saving settings).
   */
  if (JSON.parse(localStorage.getItem('powerBool'))) {
    document.getElementById('power-on').innerHTML = 'Restore Power Saver Settings';
    document.getElementById('power-on').className = 'active';
  } else {
    document.getElementById('power-on').innerHTML = 'Run Down Your Power';
  }
  document.getElementById('power-on').onclick = function() {
    if (JSON.parse(localStorage.getItem('powerBool'))) {
      updateBool('powerBool', false);
      document.getElementById('power-on').className = '';
      this.innerHTML = 'Run Down Your Power'
      chrome.power.releaseKeepAwake();
    } else {
      updateBool('powerBool', true);
      document.getElementById('power-on').className = 'active';
      this.innerHTML = 'Restore Power Saver Settings'
      chrome.power.requestKeepAwake("system");
    }
  }

  /**
   * (notifications)
   * Show/Hide button for notifications that never go away.
   * Toggles notifications bool in the background page.
   */
  if (JSON.parse(localStorage.getItem('notificationBool'))) {
    document.getElementById('toggle-notifications').innerHTML = 'Hide Persistent Notifications';
    document.getElementById('toggle-notifications').className = "active";
  } else {
    document.getElementById('toggle-notifications').innerHTML = 'Show Persistent Notifications';
  }
  document.getElementById('toggle-notifications').onclick = function(event) {
    if (JSON.parse(localStorage.getItem('notificationBool'))) {
      updateBool('notificationBool', false);
      document.getElementById('toggle-notifications').className = "";
      this.innerHTML = 'Show Persistent Notifications'
      chrome.notifications.clear('chroak', function() {});
    } else {
      updateBool('notificationBool', true);
      document.getElementById('toggle-notifications').className = "active";
      this.innerHTML = 'Hide Persistent Notifications'
      chrome.extension.getBackgroundPage().createNotification();
    }
  }

  /*
   *(system.storage)
   */

  var arrayStorageDeviceIds = [];

  chrome.system.storage.getInfo(function(info) {
    var numStorageDevices = info.length;
    var arrayDeviceNames = [];
    var arrayDeviceTypes = [];
    for(var i=0; i < numStorageDevices; i++) {
      var info_id = info[i].id;
      arrayStorageDeviceIds.push(info[i].id);
      var nameDevice = info[i].name;
      arrayDeviceNames.push(nameDevice);
      arrayDeviceTypes.push(info[i].type);
    }
    var nameStorageDevices = arrayDeviceNames.toString();
    var typeStorageDevices = arrayDeviceTypes.toString();
    document.getElementById("nameStorageDevices").innerHTML = nameStorageDevices;
    document.getElementById("numStorageDevices").innerHTML = numStorageDevices;
    document.getElementById("typeStorageDevices").innerHTML = typeStorageDevices;



    // for(var i=0; i<arrayStorageDeviceIds.length; i++) {
    //   console.log("ejecting");
    //   chrome.system.storage.ejectDevice(arrayStorageDeviceIds[i].toString(), function(result) {
    //     console.log(result);
    //   })
    // }



  })

  chrome.system.storage.onAttached.addListener(function(info) {
    var device_name = info.name;
    var device_storage = info.capacity;
    var ul = document.getElementById('knowledge-list');
    var li = "<li>You have connected a storage device with the name <span class='info'>" + device_name + "</span> and capacity <span class='info'>" + device_storage + "</span></li>.";
    ul.innerHTML = ul.innerHTML + li;
    document.getElementById("device_name") = device_name;
    document.getElementById("device_storage") = device_storage;
  })

  chrome.system.storage.onDetached.addListener(function(id) {
    var ul = document.getElementById('knowledge-list');
    var li = "<li>You have removed a storage device.</li>";
    ul.innerHTML = ul.innerHTML + li;
  })







  //messaging starts

  // chrome.gcm.register(['22916148354'], function(rId) {
  //   console.log('registered: ');
  //   console.log(rId);
  //   registerCallback(rId);
  // })


  // chrome.runtime.onStartup.addListener(function() {
  //   console.log("meow");
  //   chrome.storage.local.get("registered", function(result) {
  //     // If already registered, bail out.
  //     if (result["registered"])
  //       console.log("already registered");
  //       return;

  //     // Up to 100 senders are allowed.
  //     var senderIds = ["22916148354"];
  //     chrome.gcm.register(senderIds, registerCallback);
  //     console.log("registed senderIds");
  //     console.log("about to send message");
  //     sendMessage();
  //   });
  // });




});

function updateBool(boolName, boolVal) {
  chrome.extension.getBackgroundPage()[boolName] = boolVal;
  localStorage.setItem(boolName, JSON.stringify(boolVal));
}


// if (window == top) {
//   chrome.extension.onMessage.addListener(function(req, sender, sendMessage) {
//     console.log("Got request");
//     doStuff();
//     // sendMessage('Done!');
//   });
// }

// function doStuff() {
//   console.log("meow");
// }


// var registerCallback = function(registrationId) {

//   if (chrome.runtime.lastError) {
//     console.log("error registering!");
//     // When the registration fails, handle the error and retry the
//     // registration later.
//     return;
//   }

//   console.log('no error registering:');
//   console.log(registrationId);

//   // Send the registration token to your application server.
//   sendRegistrationId(function(succeed) {
//     // Once the registration token is received by your server,
//     // set the flag such that register will not be invoked
//     // next time when the app starts up.
//     if (succeed) {
//       chrome.storage.local.set({registered: true});

//     }

//   });


//   console.log("about to send message");
//   sendMessage();

// }

// }


// function sendRegistrationId(callback) {
//   // Send the registration token to your application server
//   // in a secure way.
// }


// chrome.runtime.onStartup.addListener(function() {
//   chrome.storage.local.get("registered", function(result) {
//     // If already registered, bail out.
//     if (result["registered"])
//       return;


//     // Up to 100 senders are allowed.
//     var senderIds = ["499742986420"];
//     chrome.gcm.register(senderIds, registerCallback);
//   });
// });


//                     //RECEIVING



                    //RECEIVING


// chrome.gcm.onMessage.addListener(function(message) {
//   console.log("received message");
//   // A message is an object with a data property that
//   // consists of key-value pairs.
// });




//                     //SENDING


// // Substitute your own sender ID here. This is the project
// // number you got from the Google Developers Console.
// var senderId = "499742986420";

// // Make the message ID unique across the lifetime of your app.
// // One way to achieve this is to use the auto-increment counter
// // that is persisted to local storage.

// // Message ID is saved to and restored from local storage.
// var messageId = 0;
// chrome.storage.local.get("messageId", function(result) {
//   if (chrome.runtime.lastError)
//     return;
//   messageId = parseInt(result["messageId"]);
//   if (isNaN(messageId))
//     messageId = 0;
// });

// // Sets up an event listener for send error.
// chrome.gcm.onSendError.addListener(sendError);

// // Returns a new ID to identify the message.
// function getMessageId() {
//   messageId++;
//   chrome.storage.local.set({messageId: messageId});
//   return messageId.toString();
// }

// function sendMessage() {
//   var message = {
//     messageId: getMessageId(),
//     destinationId: senderId + "@gcm.googleapis.com",
//     timeToLive: 86400,    // 1 day
//     data: {
//       "key1": "value1",
//       "key2": "value2"
//     }
//   };
//   chrome.gcm.send(message, function(messageId) {
//     if (chrome.runtime.lastError) {
//       // Some error occurred. Fail gracefully or try to send
//       // again.
//       console.log("error in sending message");
//       return;
//     }
//     console.log("message accepted for delivery");

//     // The message has been accepted for delivery. If the message
//     // can not reach the destination, onSendError event will be
//     // fired.
//   });
// }

// function sendError(error) {
//   console.log("Message " + error.messageId +
//       " failed to be sent: " + error.errorMessage);
// }




///////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Original Code from the Extension Tutorial that isn't useful but is still a good reference for now.
 */
///////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
// function getCurrentTabUrl(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };

//   chrome.tabs.query(queryInfo, function(tabs) {
//     // chrome.tabs.query invokes the callback with a list of tabs that match the
//     // query. When the popup is opened, there is certainly a window and at least
//     // one tab, so we can safely assume that |tabs| is a non-empty array.
//     // A window can only have one active tab at a time, so the array consists of
//     // exactly one tab.
//     console.log(tabs);
//     var tab = tabs[0];

//     // A tab is a plain object that provides information about the tab.
//     // See https://developer.chrome.com/extensions/tabs#type-Tab
//     var url = tab.url;

//     // tab.url is only available if the "activeTab" permission is declared.
//     // If you want to see the URL of other tabs (e.g. after removing active:true
//     // from |queryInfo|), then the "tabs" permission is required to see their
//     // "url" properties.
//     console.assert(typeof url == 'string', 'tab.url should be a string');

//     callback(url);
//   });

//   // Most methods of the Chrome extension APIs are asynchronous. This means that
//   // you CANNOT do something like this:
//   //
//   // var url;
//   // chrome.tabs.query(queryInfo, function(tabs) {
//   //   url = tabs[0].url;
//   // });
//   // alert(url); // Shows "undefined", because chrome.tabs.query is async.
// }

// /**
//  * @param {string} searchTerm - Search term for Google Image search.
//  * @param {function(string,number,number)} callback - Called when an image has
//  *   been found. The callback gets the URL, width and height of the image.
//  * @param {function(string)} errorCallback - Called when the image is not found.
//  *   The callback gets a string that describes the failure reason.
//  */
// function getImageUrl(searchTerm, callback, errorCallback) {
//   // Google image search - 100 searches per day.
//   // https://developers.google.com/image-search/
//   var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
//     '?v=1.0&q=' + encodeURIComponent(searchTerm);
//   var x = new XMLHttpRequest();
//   x.open('GET', searchUrl);
//   // The Google image search API responds with JSON, so let Chrome parse it.
//   x.responseType = 'json';
//   x.onload = function() {
//     // Parse and process the response from Google Image Search.
//     var response = x.response;
//     console.log(response);
//     if (!response || !response.responseData || !response.responseData.results ||
//         response.responseData.results.length === 0) {
//       errorCallback('No response from Google Image search!');
//       return;
//     }
//     var firstResult = response.responseData.results[0];
//     // Take the thumbnail instead of the full image to get an approximately
//     // consistent image size.
//     var imageUrl = firstResult.tbUrl;
//     var width = parseInt(firstResult.tbWidth);
//     var height = parseInt(firstResult.tbHeight);
//     console.assert(
//         typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
//         'Unexpected respose from the Google Image Search API!');
//     callback(imageUrl, width, height);
//   };
//   x.onerror = function() {
//     errorCallback('Network error.');
//   };
//   x.send();
// }

// function renderStatus(statusText) {
//   document.getElementById('status').textContent = statusText;
// }

// document.addEventListener('DOMContentLoaded', function() {
//   getCurrentTabUrl(function(url) {
//     // Put the image URL in Google search.
//     renderStatus('Performing Google Image search for ' + url);

//     getImageUrl(url, function(imageUrl, width, height) {

//       renderStatus('Search term: ' + url + '\n' +
//           'Google image search result: ' + imageUrl);
//       var imageResult = document.getElementById('image-result');
//       // Explicitly set the width/height to minimize the number of reflows. For
//       // a single image, this does not matter, but if you're going to embed
//       // multiple external images in your page, then the absence of width/height
//       // attributes causes the popup to resize multiple times.
//       imageResult.width = width;
//       imageResult.height = height;
//       imageResult.src = imageUrl;
//       imageResult.hidden = false;

//     }, function(errorMessage) {
//       renderStatus('Cannot display image. ' + errorMessage);
//     });
//   });
// });
