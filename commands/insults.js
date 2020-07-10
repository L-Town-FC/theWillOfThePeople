module.exports = {
    name: 'insults',
    description: 'shows who is being insulted and lets you change who it is',
    execute(message,args,money, master){
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        var insultee_and_count = fs.readFileSync('./text_files/insult_counter.txt','utf8').split(",");
        var price = 1500;
        var name = args[1];
        var success = false;
        var buyer = message.author.id;

        try{
            if (typeof(name) == 'undefined' ){
                for(i in master){
                    if(insultee_and_count[0] == i){
                        message.channel.send(`${master[i].name} is currently being insulted`)
                    }
                }
                //If no name is given, it returns who is being insulted
            }else{
                if(parseFloat(money) >= price){
                    for(i in master){
                        if(master[i].name.toLowerCase() == name.toLowerCase()){
                            insultee_and_count[0] = i;
                            insultee_and_count[1] = 1;
                            message.channel.send(`${master[insultee_and_count[0]].name} is now being insulted`)
                            purchase(price, buyer, master)
                            fs.writeFileSync("./text_files/insult_counter.txt", insultee_and_count);
                            success = true
                            //Professional Asshole  Achievement Tracker
                            unlock.tracker1(message.author.id, 13, 1,  message, master)

                            //Toxic Achievement Tracker
                            unlock.reset2(insultee_and_count[0], 20, 1)
                            unlock.tracker2(insultee_and_count[0], 20, 1, message, master)

                            if(name.toLowerCase() == 'alex'){
                                //As god intened it to be Achievement Tracker
                                unlock.unlock(buyer, 19, message, master)
                            }
                            if(buyer == insultee_and_count[0]){
                                //Masochist Achievement
                                unlock.unlock(buyer, 22, message, master)
                            }
                        }
                    }
                    if(success == false){
                        message.channel.send("Please use a valid name")
                    }
                }else{
                    message.channel.send(`You must have atleast ${price} gbp for this command`)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Insults.js");
        }

    }
}

function purchase(bet_value, player, master) {
    try{
        const fs = require('fs');

        for(i in master){
            if(i == player){
                master[i].gbp = parseFloat(master[i].gbp) - parseFloat(bet_value);
            }
        }
        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Insults.js Purchase");
    }
}