'use strict'

// chrome.browserAction.setBadgeBackgroundColor({ color: '#828282' })
// chrome.browserAction.setBadgeText({ text: 'mtn' })
chrome.browserAction.setBadgeBackgroundColor({ color: '#02a61d' })
// chrome.browserAction.setBadgeText({ text: 'meme' })

chrome.browserAction.onClicked.addListener((tab) => {
  // No tabs or host permissions needed!
  console.log('onClicked called!')
})
