module.exports = {
    name: 'insults',
    description: 'lets you insults people',
    execute(message,args, master, tracker){
        const fs = require('fs')
        const Discord = require('discord.js')
        const general = require('./Functions/GeneralFunctions')
        const embed = require('./Functions/embed_functions')
        const price = 1500
        var targetID = general.NameToUserID(args[2] || "none", master)
        var command
        if(!args[1]){
            command = 'list'
        }else{
            command = String(args[1]).toLowerCase()
        }

        switch(command){
            case 'list':
                try{
                    var insulted = []
                    for(var i in master){
                        if(master[i].insulted == true){
                            insulted.push(master[i].name)
                        }
                    }
                    var insulted_list = new Discord.MessageEmbed()
                    .setTitle('List of People being insulted')
                    .setColor(embed.Color(message))
                    insulted_list.setDescription(insulted)
                    message.channel.send(insulted_list)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in insults.js list')
                }
            break;
            case 'on':
                
                try{    
                    if(!general.CommandUsageValidator(message, master, price, price, master[message.author.id].gbp, targetID)){
                        return;
                    }
                    
                    if(master[targetID].insulted){
                        message.channel.send("They are already being insulted")
                        return
                    }

                    general.CommandPurchase(message, master, price, general.defaultRecipient)
                    
                    message.channel.send(`${master[targetID].name} is now being insulted`)
                    master[targetID].insulted = true

                    AchievementChecker(message, master, tracker, targetID);
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in insults.js on')
                }
            break;
            case 'off':
                try{                
                   
                    if(!general.CommandUsageValidator(message, master, price, price, master[message.author.id].gbp, targetID)){
                        return;
                    }
                    
                    if(!master[targetID].insulted){
                        message.channel.send("They are not being insulted")
                        return
                    }

                    general.CommandPurchase(message, master, price, general.defaultRecipient)

                    message.channel.send(`${master[targetID].name} is no longer being insulted`)
                    master[targetID].insulted = false

                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in insults.js off')
                }
            break;
            case 'help':
                try{
                    var help = fs.readFileSync('./text_files/insults/insults_commands.txt','utf-8')
                    var insults_commands = new Discord.MessageEmbed()
                    .setTitle('List of Commands')
                    .setColor(embed.Color(message))
                    insults_commands.setDescription(help)
                    message.channel.send(insults_commands)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in insults.js help')
                }
            break;
            default:
                message.channel.send('Use "!insults help" for a list of commands')
        }
    }
}


function AchievementChecker(message, master, tracker, recipient_id){

    const unlock = require('./Functions/Achievement_Functions')

    if(recipient_id == message.author.id){
        //Masochist Achievement
        unlock.unlock(recipient_id, 22, message, master)
    }
    if(recipient_id == '462798271195119626'){
        //As God Intended Achievement
        unlock.unlock(message.author.id, 19, message, master)
    }
    //Professional Asshole  Achievement
    unlock.tracker1(message.author.id, 13, 1,  message, master, tracker)

    //Toxic Achievement
    unlock.tracker2(recipient_id, 20, 1, message, master, tracker)
}