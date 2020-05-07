'use strict'
const debug = console.log

// debug.log = console.log.bind(console)
debug('main file start')

const checkUrlMatch = () => {
  const thisurl = document.location.href
  debug('checkUrlMatch', thisurl)

  return new Promise((resolve, reject) => {
    debug('calling fetchRedditData')
    fetchRedditData().then(list => {
      debug({ thisurl, list })
      const found = list.items.filter(item => item.article_url === thisurl)
      return found.length ? found : false
    }).then(matches => {
      if (matches.length) {
        debug('sending matches')
        chrome.runtime.sendMessage({ matches })
      }
      debug({ matches })
      resolve(matches)
    }).catch(reject)
  })
}

const fetchRedditData = () => {
  return new Promise((resolve) => {
    debug('fetchRedditData')
    return resolve({
      items: [
        {
          title: 'Our world nobles are save',
          url:
      'https://www.reddit.com/r/MemeThatNews/comments/gdvchm/our_world_nobles_are_save/',
          article_title:
      'upgrade your mask for BioVYZR, a personal air purifying face shield',
          article_smmry:
      'upgrade your mask for BioVYZR, a personal air purifying face shield',
          article_url:
      'https://www.designboom.com/technology/biovyzr-personal-air-purifying-face-shield-05-03-2020/',
          sub_url: 'https://www.reddit.com/r/MemeThatNews',
          sub_name: 'r/MemeThatNews'
        },
        {
          title: 'They just fell, what a tragic coincidence',
          url:
      'https://www.reddit.com/r/MemeThatNews/comments/gdx1tp/they_just_fell_what_a_tragic_coincidence/',
          article_title:
      'Three Russian doctors fall from hospital windows, raising questions amid coronavirus pandemic',
          article_smmry:
      'Three frontline health care workers have mysteriously fallen out of hospital windows in Russia over the past two weeks, heightening public attention to the working conditions for doctors and medical…',
          article_url:
      'https://edition.cnn.com/2020/05/04/europe/russia-medical-workers-windows-intl/index.html',
          sub_url: 'https://www.reddit.com/r/MemeThatNews',
          sub_name: 'r/MemeThatNews'
        },
        {
          title: 'Mind yer own business, bud',
          url:
      'https://www.reddit.com/r/MemeThatNews/comments/gde1c0/mind_yer_own_business_bud/',
          article_title:
      'NRA attacks Canada for banning assault weapons, claims it\'s equivalent to banning "freedom"',
          article_smmry:
      'The Canadian government’s decision to ban 1,500 assault-style weapons has caught the attention of an influential gun-rights group in the United States. The National Rifle Association, America’s…',
          article_url:
      'https://north99.org/2020/05/02/nra-attacks-canada-for-banning-assault-weapons-claims-canada-is-banning-freedom/',
          sub_url: 'https://www.reddit.com/r/MemeThatNews',
          sub_name: 'r/MemeThatNews'
        }
      ]
    })
  })
}
checkUrlMatch().then(() => { debug('done') })
// (async () => {
//   await
// })()
