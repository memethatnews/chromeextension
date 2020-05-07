'use strict'

const showMatches = () => {
  chrome.storage.local.get(['matches'], (matches) => {
    updateDom(matches.matches)
  })
}

const updateDom = (matches) => {
  console.log('POPUP got matches', matches)
  const wrapper = document.getElementById('matches')
  for (const match of matches) {
    const card = createRedditCard(match)
    wrapper.appendChild(card)
  }
}

const createRedditCard = item => {
  const bqElem = document.createElement('blockquote')
  bqElem.className = 'reddit-card'

  bqElem.innerHTML = `<a href="${item.url}">${item.title}</a> from <a href="${item.sub_url}">${item.sub_name}</a>`

  return bqElem
}

window.onload = showMatches
