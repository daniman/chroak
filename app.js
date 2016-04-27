document.addEventListener('DOMContentLoaded', function() {

  /**
   * (activeTab)
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

  /**
   * (fontSettings)
   * Sets size of font too large. Seriously messes up all pages related to Google.
   */
  document.getElementById('huge-font').onclick = function(event) {
    chrome.fontSettings.setDefaultFontSize({'pixelSize': 10000}, function() {});
    document.getElementById('fix-font').focus();
    document.execCommand('selectAll');
    document.execCommand("Copy", false, null);
    alert('Copied the undo action to your clipboard. Open the console and paste to undo.');
  }
  // chrome.fontSettings.clearDefaultFontSize({}, function() {}); // undo setting of font size

  /**
   * (notifications)
   * Show/Hide button for notifications that never go away.
   * Toggles notifications bool in the background page.
   */
  if (chrome.extension.getBackgroundPage().notificationBool) {
    document.getElementById('toggle-notifications').innerHTML = 'Hide Notifications'
  } else {
    document.getElementById('toggle-notifications').innerHTML = 'Show Notifications'
  }
  document.getElementById('toggle-notifications').onclick = function(event) {
    if (!chrome.extension.getBackgroundPage().notificationBool) {
      chrome.extension.getBackgroundPage().notificationBool = true;
      this.innerHTML = 'Hide Notifications'
      chrome.extension.getBackgroundPage().createNotification();
    } else {
      chrome.extension.getBackgroundPage().notificationBool = false;
      this.innerHTML = 'Show Notifications'
      chrome.notifications.clear('chroak', function() {});
    }
  }

});






chrome.gcm.register(['22916148354'], function(rId) {
  // console.log(rId);
})

var message = {
    messageId: '1',
    // destinationId: senderId + "@gcm.googleapis.com",
    destinationId: '22916148354' + "@gcm.googleapis.com",
    timeToLive: 86400,    // 1 day
    data: {
      "key1": "value1",
      "key2": "value2"
    }
  };

chrome.gcm.send(message, function(messageId) {
    if (chrome.runtime.lastError) {
      // Some error occurred. Fail gracefully or try to send
      // again.
      console.log("in error");
      return;
    }
  ;

});




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
