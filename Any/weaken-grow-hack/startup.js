/*
POSTED BY:
u/Zusias (https://www.reddit.com/user/Zusias)

POSTED ON:
June 13th, 2017

COMMENT CONTEXT:
"Ram usage 4.53, nuke all 0 port servers, scp and run 1.script 2.script on those servers. When finished with the 0 port servers, starts startup2.script to hack the 1 port servers."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



places = Array ['foodnstuff', 'sigma-cosmetics', 'joesguns', 'nectar-net', 'hong-fang-tea', 'harakiri-sushi'];
levels = Array [0, 5, 10, 20, 30, 40];

for(i = 0; i < 6; i = i) {
  if(getHackingLevel() >= levels[i]) {
    nuke(places[i]);
    for(j = 1; j < 3; j = j + 1) {
      scp(j + '.script', places[i]);
      exec(j + '.script', places[i]);
    };
    i = i + 1;
  };
  sleep(10000);
};

run('startup2.script');