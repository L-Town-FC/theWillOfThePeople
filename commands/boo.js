module.exports = {
    name: 'boo',
    description: 'lets you boo people',
    execute(message,args,money, master, tracker, command_stats){
        const fs = require('fs')
        const unlock = require("./Functions/Achievement_Functions")
        var boo = command_stats.boo
        var price = 500;
        var name = args[1];
        var success = false

        try{
            if(typeof(name) == 'undefined'){
                message.channel.send(`${master[boo].name} is currently being booed`)
            }else if(parseFloat(money) < price){
                message.channel.send(`You must have at least ${price} gbp to use this command`)
            }else{
                for(i in master){
                    if(name.toLowerCase() == master[i].name.toLowerCase()){
                        var id = i
                        command_stats.boo = id
                        purchase(price, message.author.id, message, master)
                        
                        //Professional Asshole Achievement Tracker
                        unlock.tracker1(message.author.id, 13, 1, message, master, tracker)

                        //Toxic Achievement Tracker
                        unlock.reset2(id, 20, 0, tracker, message)
                        unlock.tracker2(id, 20, 0, message, master, tracker)

                        var success = true
                        message.channel.send(`${master[id].name} is now being booed`)
                        if(message.author.id == id){
                            //Masochist Achievement
                            unlock.unlock(message.author.id, 22, message, master)
                        }
                    }
                }
                if(success == false){
                    message.channel.send("Please give a valid name")
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in Boo.js")
        }
    }
}

function purchase(bet_value, player, message, master) {
    try{
    master[player].gbp = parseFloat(master[player].gbp) - parseFloat(bet_value)


    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in Boo.js Purchase");
    }
}