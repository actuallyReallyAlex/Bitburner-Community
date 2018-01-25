/*
POSTED BY:
u/chapt3r (https://www.reddit.com/user/chapt3r)

POSTED ON:
December 12th, 2017

COMMENT CONTEXT:
"Theoretically you can use whatever delimiters you want and then use the string split() function to parse out your data.

Anything you write to the text file is stored as-is as a Javascript string. One issue right now is that if you try to display the data using Netscript's print() function, it won't display newline characters properly. However, the underlying data in the text file will still contain any newline characters that you originally wrote. Also, reading the text file using the 'cat' Terminal command does properly display line breaks.

I created a small example of how you could get csv-like data using text files. (Note I play on a Windows machine so I use the '\r\n' as line breaks. This way if I download the file they will be formatted as expected)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7jazor/how_do_txt_files_work/
*/



//Takes an array and writes the array's data to a text file as a row in
//comma-delimited csv format. 
function writeCsvRow(fn, arrData) {
    row = arrData.join(",");
    row += "\r\n";
    write(fn, row, 'a');
}

//Converts an array into a string using the format [X,X,X,X,X]
function formatArray(arr) {
    res = "[";
    res += arr.join(",");
    res += "]";
    return res;
}

//Reads a csv file and print it 
function readCsvFile(fn) {
    file = read(fn);


    rows = file.split("\r\n"); //Parse rows using newline character
    for (i = 0; i < rows.length; ++i) {
        //Parse each row into an array using split()
        row = rows[i].split(",");

        //Do whatever you want with your row. I'm just printing it
        print(formatArray(row));
    }
}



fn = "foo.txt";

clear(fn);

writeCsvRow(fn, [1,2,3,4,5,6,7,8,9,10]);
writeCsvRow(fn, [11,12,13,14,15,16,17,18,19,20]);
writeCsvRow(fn, [21,22,23,24,25,26,27,28,29,30]);

readCsvFile(fn);