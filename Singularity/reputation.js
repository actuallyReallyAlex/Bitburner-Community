/*
POSTED BY:
u/RafnarC (https://www.reddit.com/user/RafnarC)

POSTED ON:
October 12th, 2017

COMMENT CONTEXT:
"I've been spending a lot of time in the first run on the singularity bitnode and as such have made a script to level my reputation in all of the faction i am currently in and can join. I still consider my self a netscript neonate so any coments improvements would be welcome.
...
Edit updated script to use if (workForFaction(knownfactions[i], 'hacking') || workForFaction(knownfactions[i], 'fieldwork')) for detecting if your in a faction Edit added the the faction culling after you can get all their augments now to find out how to reduce the size but 10-15 gb"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/75thik/reputation_script/
*/



function work(faction){
	while (getFactionRep(faction) < rep) {
		if(!workForFaction(faction, "hacking")){
			workForFaction(faction,"fieldwork");
		}
		sleep(sleeptime);
	}
}

function workjob(company){
    if(company!="Joe's Guns"){
        applyToCompany(company,"software");
    } else{
        applyToCompany(company,"employee");
    }
    while (getCompanyRep(company) < corprep) {
        workForCompany();
        sleep(sleeptime);
    }
}

//list of all corp
corps = ["MegaCorp", "Blade Industries", "Four Sigma", "KuaiGong International", "NWO", "OmniTek Incorporated", "ECorp", "Bachman & Associates", "Clarke Incorporated", "Fulcrum Technolgies"];
//list of all factions
knownfactions = ["Sector-12", "Aevum", "Tian Di Hui", "Chongqing", "New Tokyo", "Ishima", "Volhaven", "CyberSec", "NiteSec", "The Black Hand", "BitRunners", "Fulcrum Secret Technologies", "Bachman & Associates", "MegaCorp", "KuaiGong International", "Clarke Incorporated", "Blade Industries", "Four Sigma", "ECorp", "OmniTek Incorporated", "Netburners", "Slum Snakes", "Daedalus", "Tetrads", "Illuminati", "The Covenant", "NWO"];
// creating the a list of faction your already in 
currentfactions =[];
deletefactions= [];
// other preset veriables
rep = 5000;
maxcorprep = 250000;
corprep = 10000;
corpindex = 0;
sleeptime =240000;
//starting the loop
while (true){
    // check faction invites and accept them then remove them from the knowfacttions list 
    invites = checkFactionInvitations();
    if (invites.length > 0 ){
        for (i=0; i<invites.length;i++){
            joinFaction(invites[i]);
            currentfactions.push(invites[i]);
            index = knownfactions.indexOf(invites[i]);
            if (index > -1){
                knownfactions.splice(index, 1);
            }
        }
    }


    // check and see if your are already in a faction and add it to the working list 
    deletefactions = [];
    for(i=0;i<knownfactions.length;i++){
        if (workForFaction(knownfactions[i], 'hacking') || workForFaction(knownfactions[i], 'fieldwork')){
            //tprint("adding to list "+ knownfactions[i]);
            currentfactions.push(knownfactions[i]);
            deletefactions.push(knownfactions[i]);
        }
    }
    for (i=0;i<deletefactions.length; i++ ){

        index = knownfactions.indexOf(deletefactions[i]);
        if (index > -1){
            knownfactions.splice(index, 1);
        }
    }

    //Cull faction you can already buy all augments from (excluding "NeuroFlux Governor")
    actionaugs= [];
    cullfactions= [];
    for(i=0;i<currentfactions.length;i++){
        factionaugs = getAugmentationsFromFaction(currentfactions[i]);
        topaug=1;
        for(n=0;n<factionaugs.length;n++){
            if (factionaugs[n]!="NeuroFlux Governor"){
                topaug=Math.max(getAugmentationCost(factionaugs[n])[0], topaug);
            }
        }
         if (getFactionRep(currentfactions[i])>topaug){
            cullfactions.push(currentfactions[i]);
         }
    }
    tprint("done");
    for(i=0;i<cullfactions.length;i++){
        index = currentfactions.indexOf(cullfactions[i]);
        if (index > -1){
            currentfactions.splice(index,1);
        }

    }



    //Check if your in a faction to get rep from 
    if(currentfactions.length>0){

        // work for faction
        for (i=0;i<currentfactions.length;i++){
            work(currentfactions[i]);
        }
        rep += 10000;
    }
    //work job
    if(getHackingLevel()>250){
        if (corpindex < corps.length){
            workjob(corps[corpindex]);
            corprep += 10000;
            // switching to a new corp if your rep is above 250000 or the set maxcorprep
            if (getCompanyRep(corps[corpindex]) > maxcorprep ){
                corpindex++;
                corprep = 10000;
            }
        }
    } else {
        workjob("Joe's Guns");
    }
    //if(getStatLevel('Cha')<1000){
        travelToCity('Volhaven');
        universityCourse('ZB Institute of Technology','Leadership');
        sleep(sleeptime*2);
    //}

}