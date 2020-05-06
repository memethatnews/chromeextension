const Fuse = require("fuse.js");

const retext = require("retext");
const pos = require("retext-pos");
const keywords = require("retext-keywords");
const toString = require("nlcst-to-string");
retext()
  .use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
  .use(keywords);

const list = [
  {
    title: "Our world nobles are save",
    url:
      "https://www.reddit.com/r/MemeThatNews/comments/gdvchm/our_world_nobles_are_save/",
    article_title:
      "upgrade your mask for BioVYZR, a personal air purifying face shield",
    article_smmry:
      "upgrade your mask for BioVYZR, a personal air purifying face shield",
    article_url:
      "https://www.designboom.com/technology/biovyzr-personal-air-purifying-face-shield-05-03-2020/",
  },
  {
    title: "They just fell, what a tragic coincidence",
    url:
      "https://www.reddit.com/r/MemeThatNews/comments/gdx1tp/they_just_fell_what_a_tragic_coincidence/",
    article_title:
      "Three Russian doctors fall from hospital windows, raising questions amid coronavirus pandemic",
    article_smmry:
      "Three frontline health care workers have mysteriously fallen out of hospital windows in Russia over the past two weeks, heightening public attention to the working conditions for doctors and medical…",
    article_url:
      "https://edition.cnn.com/2020/05/04/europe/russia-medical-workers-windows-intl/index.html",
  },
  {
    title: "Mind yer own business, bud",
    url:
      "https://www.reddit.com/r/MemeThatNews/comments/gde1c0/mind_yer_own_business_bud/",
    article_title:
      'NRA attacks Canada for banning assault weapons, claims it\'s equivalent to banning "freedom"',
    article_smmry:
      "The Canadian government’s decision to ban 1,500 assault-style weapons has caught the attention of an influential gun-rights group in the United States. The National Rifle Association, America’s…",
    article_url:
      "https://north99.org/2020/05/02/nra-attacks-canada-for-banning-assault-weapons-claims-canada-is-banning-freedom/",
  },
];

(async () => {
  process.nextTick(async () => {
    await main();
  });
})();

const main = async () => {
  for (const item of list) {
    const kws = await retextKwProcess(
      `${item.article_title} ${item.article_smmry}`
    );

    item.kws = kws;
  }

  console.log(list);

  const fuseOpts = {
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    // includeMatches: true,
    findAllMatches: true,
    // minMatchCharLength: 1,
    // location: 0,

    threshold: 0.6,
    distance: 100,
    useExtendedSearch: true,
    // keys: ["article_title", "article_smmry", "article_url"],
    keys: ["article_title", "kws"],
  };
  const fuse = new Fuse(list, fuseOpts);

  // Change the pattern
  const pattern = "mask | biovyzr | air | face | shield";

  const result = fuse.search(pattern);
  console.log("result", result);

  process.exit(0);
};

const retextKwProcess = (text) => {
  return new Promise((resolve, reject) => {
    retext()
      .use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
      .use(keywords)
      .process(text, (err, file) => {
        if (err) {
          return reject(err);
        }

        //turns 'is not' into "isn't", and "he is" into "he's"
        const contracted = {
          am: "m",
          will: "ll",
          would: "d",
          have: "ve",
          are: "re",
          not: "t",
          is: "s",
          // 'was': 's' //this is too folksy
        };
        const moreStopwords = "me im ive weve was".split(" ");
        const keywords = [];
        file.data.keywords.forEach(function (keyword) {
          const kw = `${toString(keyword.matches[0].node)}`.toLowerCase();
          for (const c of Object.values(contracted)) {
            const rx = new RegExp(`('|\`|"|،|’)${c}`, "ig");
            const matches = kw.match(rx);
            if (matches && matches.length > 0) {
              return;
            }
          }

          // check against stop words - first remove any non letter character - eg. 'me-' ===> 'me'
          if (moreStopwords.indexOf(kw.replace(/[^a-zA-Z0-9]/, "")) !== -1) {
            return;
          }

          keywords.push(kw);
        });

        return resolve(
          keywords.map((s) => s.replace(/\s/, "")).filter((s) => !isEmpty(s))
        );
      });
  });
};

const isEmpty = (s) =>
  s === undefined || s === null || s === false || `${s}`.trim() === "";
