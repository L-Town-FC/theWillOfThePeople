module.exports = {
    name: 'bank',
    description: 'says currency amount',
    execute(message,args, master){
        const Discord = require('discord.js');
        const fs = require('fs')
        const unlock = require("./Functions/Achievement_Functions")
        const embed = require('./Functions/embed_functions')
        const max_amount = 30000
        var name = args[1];
        var command = args[1]
        var names = []

        try{

            for(i in master){
                names.push(master[i].name.toLowerCase())
            }
            if(!command){
                command = 'name'
                var person = message.author.id
            }else if(names.includes(command.toLowerCase()) == true){
                command = 'name'
                for(i in master){
                    if(master[i].name.toLowerCase() == name.toLowerCase()){
                        var person = i
                    }
                }
            }
            try{
                if(message.channel.id == 711634711281401867 || message.channel.id == 702205197740540004){
                    message.channel.bulkDelete(1)

                    //Your a Dumnass Achievement
                    unlock.unlock(message.author.id, 7, message, master)
                }else{
                    switch(command){
                        case 'all':
                            try{
                                    var everyone = [];
                                    var counter = 0
                                    var total = 0
                                    var total_private = 0
                                    for(i in master){
                                        everyone[counter] = `${master[i].name}: ${master[i].gbp}`;
                                        counter = counter + 1;
                                        total = total + master[i].gbp
                                        total_private += master[i].account
                                    }
                                    const message_embed = new Discord.MessageEmbed()
                                    .setTitle("List of all Public accounts on Server")
                                    .setDescription(everyone)
                                    .addField(`Total GBP on Server`, total.toFixed(2))
                                    .setColor(embed.Color(message))
                                    message.channel.send(message_embed)
                            }catch(err){
                                console.log(err)
                                message.channel.send('Error occurred in bank.js all')
                            }
                        break;
                        case 'name':
                            try{
                            
                                    message.channel.send(`${master[person].name} has ${master[person].gbp} gbp`);
                                
                            }catch(err){
                                console.log(err)
                                message.channel.send('Error occurred in bank.js name')
                            }
                        break;
                        case 'help':
                            try{
                                var help = fs.readFileSync('text_files/bank_commands.txt', 'utf-8').split("\n")
                                const help_list = new Discord.MessageEmbed()
                                .setTitle("List of Commands")
                                .setDescription(help)
                                .setColor(embed.Color(message))
                                message.channel.send(help_list)
                            }catch(err){
                                console.log(err)
                                message.channel.send("Error occured in bank.js help")
                            }
                        break;
                        default:
                            message.channel.send('Use "!bank help" for a list of commands')
                    }
                }

            }catch(err){
                console.log(err)
                message.channel.send('Error Occured in bank.js')
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in bank.js')
        }
    }
}
