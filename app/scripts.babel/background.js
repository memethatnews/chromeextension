'use strict'

chrome.runtime.onInstalled.addListener(details => {
  console.log('onInstalled', details)
  chrome.storage.local.set({ debug: '*' })
  console.log('previousVersion', details.previousVersion)
})

chrome.browserAction.setBadgeBackgroundColor({ color: '#828282' })
chrome.browserAction.setBadgeText({ text: 'mtn' })

// console.log('\'Allo \'Allo! Event Page for Browser Action')

chrome.runtime.onMessage.addListener(function (req, sender) {
  console.log('onmessage', req)
  if (req.matches) {
    chrome.browserAction.setBadgeBackgroundColor({ color: '#02a61d' })
    chrome.browserAction.setBadgeText({ text: 'meme' })

    console.log('[background script] got matches: req', req)
    chrome.storage.local.set({ matches: req.matches })
    chrome.pageAction.show(sender.tab.id)
    chrome.pageAction.setTitle({ tabId: sender.tab.id, title: req.matches[0].article_title })
  }
})
