/*
POSTED BY:
u/Zusias (https://www.reddit.com/user/Zusias)

POSTED ON:
June 13th, 2017

COMMENT CONTEXT:
"RAM usage 4.76, nukes 1 port servers (that have money) and scps/runs 1.script and 2.script on those servers. When finished, runs startup3.script to start nuking the 2 port servers."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



places = Array ['neo-net', 'zer0', 'max-hardware', 'iron-gym'];
levels = Array [50, 75, 80, 100];

for(i = 0; i < 4; i = i) {
  if(getHackingLevel() >= levels[i]) {
    if(fileExists('brutessh.exe')) {
      brutessh(places[i]);
      nuke(places[i]);
      for(j = 1; j < 3; j = j + 1) {
        scp(j + '.script', places[i]);
        exec(j + '.script', places[i]);
      };
      i = i + 1;
    };
  };
  sleep(10000);
};

run('startup3.script');