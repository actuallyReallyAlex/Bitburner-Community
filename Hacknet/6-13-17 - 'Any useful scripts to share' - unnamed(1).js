/*
POSTED BY:
u/Zusias (https://www.reddit.com/user/Zusias)

POSTED ON:
June 13th, 2017

COMMENT CONTEXT:
"Ram usage, 7.4. Buy nodes in a semi-optimized pattern up to level 71. I chose level 71 arbitrarily as that's about the point where any further upgrades take about an hour or longer to pay for themselves. You may want to include a sleep statement under the upgradeLevel block if it's using your money a bit too quickly."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



maxLevel = 10;
nodes = 1;
while(maxLevel < 71 || nodes < 19) {
  nodes = hacknetnodes.length;
  for(i = 0; i < nodes; i = i) {
    level = hacknetnodes[i].level;
    if(level < maxLevel) {
      hacknetnodes[i].upgradeLevel(maxLevel - level);
    } else {
      i = i + 1;
    };
  };

  purchase = false;

  if(nodes < 3) {
    purchase = true;
  } elif(maxLevel < 20) {
    maxLevel = 20;
  } elif(nodes < 6) {
    purchase = true;
  } elif(maxLevel < 30) {
    maxLevel = 30;
  } elif(nodes < 9) {
    purchase = true;
  } elif(maxLevel < 40) {
    maxLevel = 40;
  } elif(nodes < 12) {
    purchase = true;
  } elif(maxLevel < 50) {
    maxLevel = 50;
  } elif(nodes < 15) {
    purchase = true;
  } elif(maxLevel < 60) {
    maxLevel = 60;
  } elif(nodes < 17) {
    purchase = true;
  } elif(maxLevel < 71) {
    maxLevel = 71;
  } elif(nodes < 19) {
    purchase = true;
  };

  if(purchase) {
    purchaseHacknetNode();
  };
};