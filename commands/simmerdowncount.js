module.exports = {
    name: 'simmerdowncount',
    description: 'counts how many times simmer down is said',
    execute(message,args){
        var said_simmer = -2
        var said_down = 0
        const Discord = require('discord.js');
        const bot = new Discord.Client();
        var user = message.author.id;
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
                        counter(user, message);
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

function counter(person, message) {
    try{
        const fs = require('fs');
        var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        
        for(i in master){
            if(master[i].simmerdown == null){
                master[i].simmerdown = 0;
            }
            if(person == i){
                master[i].simmerdown = parseInt(master[i].simmerdown) + 1
            }
        }
        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Simmerdowncount.js Counter");
    }
}


