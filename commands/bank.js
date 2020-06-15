module.exports = {
    name: 'bank',
    description: 'says currency amount',
    execute(message,args){
        const fs = require('fs');
        const Discord = require('discord.js');
        const unlock = require("./Functions/Achievement_Functions")
        var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        var user = message.author.id;
        var name = args[1];
        var success = false;
        
        try{
            if(message.channel.id == 711634711281401867 || message.channel.id == 702205197740540004){
                message.channel.bulkDelete(1)
                unlock.unlock(user, 7, message, master)
            }else if(typeof(name) == 'undefined'){
                for(i in master){
                    if(user == i){
                        message.channel.send(`${master[i].name} has ${master[i].gbp} gbp`);
                    }
                }
            }else if(name.toLowerCase() == 'all'){
                var everyone = [];
                var counter = 0
                for(i in master){
                    everyone[counter] = `${master[i].name}: ${master[i].gbp}`;
                    counter = counter + 1;
                }
                const message_embed = new Discord.RichEmbed()
                .setTitle("List of all bank accounts on Server")
                .setDescription(everyone)
                message.channel.send(message_embed)
            }else{
                for(i in master){
                    if(master[i].name.toLowerCase() === name.toLowerCase()){
                        message.channel.send(`${master[i].name} has ${master[i].gbp} gbp`);
                        success = true
                    }
                }
                if(success == false){
                    message.channel.send("Please use a valid name")
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in bank.js");
        }   
    }
}