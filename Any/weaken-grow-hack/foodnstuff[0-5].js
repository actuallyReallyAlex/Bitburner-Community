/*
POSTED BY:
u/boz987 (https://www.reddit.com/user/boz987)

POSTED ON:
June 13th, 2017

COMMENT CONTEXT:
"Update Version:

I have scripts such as foodnstuff[0-5].scipt for each server on home, where 0 is hack / grow, and 1-4 are weaken / grow.
..."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



avialports = 0;
count = 0;
places = Array ['foodnstuff','sigma-cosmetics','joesguns','nectar-net','hong-fang-tea','harakiri-sushi','neo-net','zer0','max-hardware','iron-gym','phantasy','silver-helix','omega-net','crush-fitness','johnson-ortho','the-hub','comptek','netlink','rothman-uni','catalyst','summit-uni','rho-construction','millenium-fitness','aevum-police','alpha-ent','syscore','lexo-corp','snap-fitness','global-pharm','applied-energetics','unitalife','univ-energy','nova-med','zb-def','zb-institute','vitalife','titan-labs','solaris','microdyne','helios','deltaone','icarus','zeud-med','omnia','defcomm','galactic-cyber','infocomm','taiyang-digital','stormtech','aerocorp','clarkeinc','omnitek','nwo','4sigma','blade','b-and-a','ecorp','fulcrumtech','megacorp','kuai-gong','fulcrumassets','powerhouse-fitness'];
levels = Array [1,5,10,20,30,40,50,75,80,100,100,150,200,250,275,300,350,400,400,425,450,500,500,425,550,600,700,750,775,775,790,790,800,800,750,775,795,800,800,800,810,810,810,825,825,825,830,850,850,850,900,900,900,900,900,900,900,900,900,925,999,1000];
ports = Array [0,0,0,0,0,0,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5];

while (true) {
	for (i = count; i < 62; i = i+1) {
		if (fileExists('SQLInject.exe')) { 
			avialports = 5;
		} elif (fileExists('HTTPWorm.exe')) { 
			avialports = 4;
		} elif (fileExists('relaySMTP.exe')) { 
			avialports = 3;
		} elif (fileExists('FTPCrack.exe')) { 
			avialports = 2;
		} else { 
			avialports = 1;
		};


		if (ports[i] <= avialports) {
			if (levels[i] <= getHackingLevel()) {
				if (fileExists('BruteSSH.exe')) {brutessh(places[i]);};
				if (fileExists('FTPCrack.exe')) {ftpcrack(places[i]);};
				if (fileExists('relaySMTP.exe')) {relaysmtp(places[i]);};
				if (fileExists('HTTPWorm.exe')) {httpworm(places[i]);};
				if (fileExists('SQLInject.exe')) {sqlinject(places[i]);};
				if (hasRootAccess(places[i]) == false) {
					nuke(places[i]);
					count = count + 1;
				};
			if (hasRootAccess(places[i])) {
			if (isRunning(places[i] + '0.script') == false) {exec(places[i] + '0.script','home',10);};
			if (isRunning(places[i] + '1.script') == false) {exec(places[i] + '1.script','home',90);};
			if (isRunning(places[i] + '2.script') == false) {exec(places[i] + '2.script','home',90);};
			if (isRunning(places[i] + '3.script') == false) {exec(places[i] + '3.script','home',90);};
			if (isRunning(places[i] + '4.script') == false) {exec(places[i] + '4.script','home',90);};
			};

			};
		};
	};
};