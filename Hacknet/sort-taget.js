/*
POSTED BY:
u/JohnHarr (https://www.reddit.com/user/JohnHarr)

POSTED ON:
January 16th, 2017

COMMENT CONTEXT:
"I am currently trying to automate everything I can (my scripts are based off of MercuriusXeno work). I am running into difficulty with the length it takes to sort arrays by number when trying to automate targeting for my servers. I changed MercuriusXeno's start.script file to output target's server and the target's weight to a text file. I would then use another script to read that text file, create an ordered target list, and output those targets into text files for each server to read.

The .txt file that the start.script outputs is called "vulnerable.txt" and it is ordered as follows (the full .txt file that I am trying to process is at the end of this post): [target0 weight0 target1 weight1 target2 weight2 ... ]

For sorting, .sort() is pretty quick (I believe that this is due to it using javascript instead of going through BitBurner's code), but it sorts alphabetically. I tried a few things to get it to sort numerically, but these either did not work (due to differences in how BitBurner handles functions) or took very long to sort the file.

I am hoping that someone here has run into this problem and has a potential solution. Note that I am not a programmer, so my code is extremely likely to be not optimal, so if you have any suggestions on what I can improve please let me know.

My current code works, it is just much to slow for what I am aim for it to do (currently it takes >30 minutes for a list 122 long or 61 targets). My current code has a lot of tprints, but those are mainly for me to check on what is happening between steps.

The current code I am using is below (Sorry if this is not formatted properly. I usually just lerk and don't post much of anything):

sort-target.script - Cost: 5.60 GB

use run sort-target

"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7qq1rc/looking_for_faster_way_to_sort_data_by_number/
*/


//this script should be run on "home" to have a central location for .txt files
//this script is used to generate a optimized target list for servers
//it is a separate file for troubleshooting and to keep expensive read commands out of continuous scripts
//this is clunky and most likely not the optimal way to do this

//define full target list as an array
targetList = [];
//this array will store the weight determine in start.script for each pair
targetWeight = [];
//sorted list of weights
weightSorted = [];
//this array will be the order number list
targetOrder = [];
//read .txt file created by the start.script
targetList = read("vulnerable.txt");
//split array by spaces
//the way that the write sections of start.script are written, all targets and weights are separated by spaces
targetList = targetList.split(" ");
//remove the space from the end of the array
//the .txt file will end in a space (which is now included in the array) due to how it is written
finalSpace = targetList.length - 1;
targetList.splice(finalSpace,1);
//this is the total length of the array starting from 1
//this should always be an even number
lengthTarget = targetList.length;
tprint("targetList length = " + lengthTarget);
//this is the number of targets included in the list
numberTarget = lengthTarget / 2;
tprint("number of targets = " + numberTarget);
//this is to determine how many targets should be obtained by the final check
//the idea is to not make the script run too long if there are more targets than you can use on servers
if(numberTarget > 26) {
    usedTarget = 25;
} else {
    usedTarget = numberTarget;
}

tprint(targetList);
//as the targetList array will always be ["target","weight",etc.], we will have to account for the list being is sets of 2
//we sort by the weight, but we need to drag the target along
for(i = 0; i < lengthTarget; i++ ) {
    //the weight numbers will always be odd, this is a clunky way of forcing that with a for loop
    //each loop will add one and then add one here to use the weight as i in the loop
    i += 1;
    //this will be a list of only the weights for the targets
    //the goal is to sort this list and find the matching weight in the targetList to get the targets in order
    targetWeight[((i+1)/2)-1] = targetList[i];
}
//create a duplicate of the orginal targetWeight array
//I originally was going to use this to compare at the end, but that just adding another comparision to the targetList file
weightSorted = targetWeight.slice();

tprint("Pre-sort");
//this was an attempt to get sorting to work how I wanted it to
1*weightSorted;
tprint("weightSorted length = " + weightSorted.length);

//this is currently a bubble sort
swap = 0;
swapCount = 1;
while(swapCount > 0){
    swapCount = 0;
    for (i = 0; i < weightSorted.length -1; i++){
        tprint(i);
        if(weightSorted[i]-weightSorted[i+1] < 0){
            swap = weightSorted[i];
            weightSorted[i] = weightSorted[i+1];
            weightSorted[i+1] = swap; 
            swapCount += 1;
        }
    }
    //for debugging and knowing that the script is still working
    tprint("Sorting new swap");
}
//debugging
tprint("Post-sort");
tprint(weightSorted);

//after sorting the weights, this is used to get the server name of the weights and get the in the proper order
for(i = 0; i < usedTarget; i++) {
    tprint("Searching for targetOrder " + i);
    //search for the matching weight in the targetList
    for(j = 0; j < lengthTarget; j++){
        //since this is based off of the targetList, we need to account for the ["target","weight"] issue again
        j += 1;
        //check the sorted list to the orginal list to get the server name
        if(weightSorted[i] == targetList[j]) {
            targetOrder[i] = targetList[j-1];
            tprint("targetOrder " + i + " was found");
            tprint("pserv-" + i + " target = " + targetOrder[i]);
            write("pserv-" + i + ".txt",targetOrder[i],"w");
            break;
        }
    }
}
tprint(targetOrder);
//run the script that kills all scripts on servers and retargets them using the associated .txt file
run("restart-server.script",1);