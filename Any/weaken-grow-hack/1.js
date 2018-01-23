/*
POSTED BY:
u/Zusias (https://www.reddit.com/user/Zusias)

POSTED ON:
June 13th, 2017

COMMENT CONTEXT:
"..."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



a = getHostname();
while(1) {
  if (getServerMoneyAvailable(a) < 900000) {
    grow(a);
  } else {
    hack(a);
  }
};