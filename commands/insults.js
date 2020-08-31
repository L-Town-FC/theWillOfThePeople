module.exports = {
    name: 'insults',
    description: 'lets you insults people',
    execute(message,args,money, master, tracker){
        const fs = require('fs')
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        const unlock = require('./Functions/Achievement_Functions')
        const price = 1500
        var command
        if(!args[1]){
            command = 'list'
        }else{
            command = String(args[1]).toLowerCase()
        }

        switch(command){
            case 'list':
                var insulted = []
                for(var i in master){
                    if(master[i].insulted == true){
                        insulted.push(master[i].name)
                    }
                }
                var insulted_list = new Discord.RichEmbed()
                .setTitle('List of People being insulted')
                .setColor(embed.Color(message))
                insulted_list.setDescription(insulted)
                message.channel.send(insulted_list)
            break;
            case 'on':
                var name = args[2] || 'none'
                if(money < price){
                    message.channel.send(`You need atleast ${price} gbp to use this command`)
                }else{
                    for(var i in master){
                        if(master[i].name.toLowerCase() == String(name).toLowerCase()){
                            if(master[i].insulted == true){
                                message.channel.send(`${master[i].name} is already being insulted`)
                            }else{
                                message.channel.send(`${master[i].name} is now being insulted`)
                                master[i].insulted = true
                                master[message.author.id].gbp -= price
                                if(i == message.author.id){
                                    unlock.unlock(i, 22, message, master)
                                }
                                if(i == '462798271195119626'){
                                    unlock.unlock(i, 19, message, master)
                                }
                                //Professional Asshole  Achievement Tracker
                                unlock.tracker1(message.author.id, 13, 1,  message, master, tracker)

                                //Toxic Achievement Tracker
                                //unlock.reset2(message.author.id, 20, 1, tracker)
                                unlock.tracker2(message.author.id, 20, 1, message, master, tracker)
                            }
                            var success = true
                        }
                    }
                    if(typeof(success) == 'undefined'){
                        message.channel.send(`The specified person doesn't exist`)
                    }
                }
            break;
            case 'off':
                var name = args[2] || 'none'
                if(money < price){
                    message.channel.send(`You need atleast ${price} gbp to use this command`)
                }else{
                    for(var i in master){
                        if(master[i].name.toLowerCase() == String(name).toLowerCase()){
                            if(master[i].insulted == false){
                                message.channel.send(`${master[i].name} is not being insulted`)
                            }else{
                                message.channel.send(`${master[i].name} is no longer being insulted`)
                                master[i].insulted = false
                                master[message.author.id].gbp -= price
                            }
                            var success = true
                        }
                    }
                    if(typeof(success) == 'undefined'){
                        message.channel.send(`The specified person doesn't exist`)
                    }
                }
            break;
            case 'suggest':
                var suggestion = message.cleanContent.split('!insults suggest')
                if(suggestion[1] !== ""){
                    var suggested = JSON.parse(fs.readFileSync('./JSON/insults_suggestions.json', 'utf-8'))
                    suggested.suggestions.push(suggestion[1])
                    message.channel.send('Your suggestion has been logged')
                    fs.writeFileSync ("./JSON/insults_suggestions.json", JSON.stringify(suggested, null, 2), function(err) {
                        if (err) throw err;
                        console.log('complete');
                        }
                    );
                }else{
                    message.channel.send(`You didn't suggest anything`)
                }
            break;
            case 'help':
                var help = fs.readFileSync('./text_files/insults/insults_commands.txt','utf-8')
                var insults_commands = new Discord.RichEmbed()
                .setTitle('List of Commands')
                .setColor(embed.Color(message))
                insults_commands.setDescription(help)
                message.channel.send(insults_commands)
            break;
            default:
                message.channel.send('Use "!insults help" for a list of commands')
        }
    }
}
