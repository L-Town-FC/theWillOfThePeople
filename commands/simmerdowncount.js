module.exports = {
    name: 'simmerdowncount',
    description: 'counts how many times simmer down is said',
    execute(message,args){
        var said_simmer = -2
        var said_down = 0
        const Discord = require('discord.js');
        const bot = new Discord.Client();
        var user = message.author.discriminator;
        try{
            //Variables that hold the location of simmer/down in the sentence
            if (message.author === bot.user){
            //makes sure the bot doesn't read what it says
            }else{
                simmer = message.content.toLowerCase().split(" ")
                //converts the user's message into an array of all lower case words

                var i; 
                for (i = 0; i < simmer.length; i++) {
                    if (simmer[i] == 'simmer'){
                    said_simmer = i;
                    //checks if the word simmer is used. If it is, then its location is tracked so to see if 'down' follows it
                    };
                    if (simmer[i] == 'down'){
                        said_down = i;
                        //checks if down is used and marks its location
                    }
                    if (said_simmer - said_down == -1){
                        counter(user);
                        said_simmer = -2;
                        said_down = 0;

                        //checks if 'down' is said immediatly after 'simmer'. If this is true then it increases the simmer_count and ...
                        //resets the location of simmer and down
                    }
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Simmerdowncount.js");
        }
    }
}

function counter(person) {
    try{
        const fs = require('fs');
        var main = fs.readFileSync('./text_files/simmer_down.txt','utf8');
        var name_count = main.split(",");
        var discrim_name_simmer = [];
        var array = [];
        var final_array = [];


        for (i = 0; i < name_count.length; i++) {
            discrim_name_simmer[i] = name_count[i].split(" ");
        }
        //breaks .txt into individual person/money pairs

        for (i = 0; i < discrim_name_simmer.length; i++) {
            array[i] = {discrim: discrim_name_simmer[i][0],
                        name: discrim_name_simmer[i][1],
                        count: discrim_name_simmer[i][2]}
        }
        //turns each pair into an object array

        for (i = 0; i < array.length; i++) {
            if(array[i].discrim === person){
                array[i].count = parseInt(array[i].count) + 1;
            }
        }
        //assigns just the names in the object array to another array that can be used to cross reference the current players name


        for (j = 0; j < array.length; j++) {
            final_array[j] = array[j].discrim + " " + array[j].name + " " + array[j].count;
        }
        //converts object array back into normal array that can be easily written into a text file

        fs.writeFileSync('./text_files/simmer_down.txt', final_array);
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Simmerdowncount.js Counter");
    }
}


