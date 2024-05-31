module.exports = {
    name: 'bank',
    description: 'says currency amount',
    execute(message,args, master){
        const unlock = require("./Functions/Achievement_Functions")
        const embed = require('./Functions/embed_functions')
        const general = require('./Functions/GeneralFunctions')
        var targetID;
        try{
            //checks if command is run in bot tinkering. deletes it and awards achievement if it has
            if(message.channel.id == 711634711281401867 || message.channel.id == 702205197740540004){
                message.channel.bulkDelete(1)
    
                //Your a Dumnass Achievement
                unlock.unlock(message.author.id, 7, message, master)
                return
            }
    
            //checks if empty command has been sent
            if(args.length < 2){
                args[1] = general.invalid
            }
    
            //gets user id from name
            targetID = general.NameToUserID(args[1].toLowerCase(), master)
    
            //runs all function if specified
            if(args[1].toLowerCase() == 'all'){
                BankAll(message, master, embed)
                return
            }
    
            //runs hepl function if specified
            if(args[1].toLowerCase() == 'help'){
                Help(message, master, embed)
                return
            }
    
            //if no person is specified or the specified name doesnt exist, the author's gbp is sent
            if(targetID == general.invalid){
                message.channel.send(`${master[message.author.id].name} has ${master[message.author.id].gbp} gbp`);
                return
            }

            //sends the target's gbp
            message.channel.send(`${master[targetID].name} has ${master[targetID].gbp} gbp`);
            
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in Bank.js")
        }
    }
}

function BankAll(message, master){
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')

    var everyone = [];
    var total = 0

    for(i in master){
        everyone.push(`${master[i].name}: ${master[i].gbp}`);
        total = total + master[i].gbp
    }

    const message_embed = new Discord.MessageEmbed()
    .setTitle("List of all Accounts on Server")
    .setDescription(everyone)
    .addField(`Total GBP on Server`, total.toFixed(2))
    .setColor(embed.Color(message))
    message.channel.send(message_embed)
}

function Help(message){
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    const fs = require('fs')

    var help = fs.readFileSync('text_files/bank_commands.txt', 'utf-8').split("\n")
    const help_list = new Discord.MessageEmbed()
    .setTitle("List of Commands")
    .setDescription(help)
    .setColor(embed.Color(message))
    message.channel.send(help_list)
}