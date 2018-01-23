/*
POSTED BY:
u/goku90504 (https://www.reddit.com/user/goku90504)

POSTED ON:
June 14th, 2017

COMMENT CONTEXT:
"Not sure if this is a feature or bug but this script gives root access to nearly everything as soon as you buy the 5 programs from the dark web (you know which programs the ones that don't start with Deep)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



places = Array ['foodnstuff','sigma-cosmetics','joesguns','nectar-net','hong-fang-tea','harakiri-sushi','neo-net','zer0','max-hardware','iron-gym','phantasy','silver-helix','omega-net','crush-fitness','johnson-ortho','the-hub','comptek','netlink','rothman-uni','catalyst','summit-uni','rho-construction','millenium-fitness','aevum-police','alpha-ent','syscore','lexo-corp','snap-fitness','global-pharm','applied-energetics','unitalife','univ-energy','nova-med','zb-def','zb-institute','vitalife','titan-labs','solaris','microdyne','helios','deltaone','icarus','zeud-med','omnia','defcomm','galactic-cyber','infocomm','taiyang-digital','stormtech','aerocorp','clarkeinc','omnitek','nwo','4sigma','blade','b-and-a','ecorp','fulcrumtech','megacorp','kuai-gong','fulcrumassets','powerhouse-fitness'];

for (i = 0; i < 62; i = i+1) {
sqlinject(places[i]);
httpworm(places[i]);
relaysmtp(places[i]);
ftpcrack(places[i]);
brutessh(places[i]);
nuke(places[i]);
};