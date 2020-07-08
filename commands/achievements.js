const { unlock } = require('./Functions/Achievement_Functions');

module.exports = {
    name: 'achievements',
    description: 'shows achievements',
    execute(message,args){
        const fs = require('fs');
        const Discord = require('discord.js');
        const embed = require('./Functions/embed_functions')
        const unlock = require('./Functions/Achievement_Functions')
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
        var user = message.author.id;
        var name = args[1];
        var success = false;
        
        try{
            unlock.tracker1(user, 45, 1, 5, message, master)
            if(typeof(name) == 'undefined'){
                for(i in master){
                    if(user == i){
                        Achievements(user, master, message, embed)
                    }
                }
            }else if(name.toLowerCase() == 'list'){
                var list = []
                var counter = 0
                for(i in achievements){
                    list[counter] = `${i}. ${achievements[i].name}`
                    counter = counter + 1
                }
                const achievements_list = new Discord.RichEmbed()
                .setTitle("List of All Achievements")
                .setDescription(list)
                .setColor(embed.Color(message))
                message.channel.send(achievements_list)
            }else if(name.toLowerCase() == 'help'){
                var help = fs.readFileSync('./text_files/achievement_commands', 'utf-8')
                const command_list = new Discord.RichEmbed()
                .setTitle("List of Commands")
                .setDescription(help)
                .setColor(embed.Color(message))
                message.channel.send(command_list)
            }else{
                for(i in master){
                    if(master[i].name.toLowerCase() === name.toLowerCase()){
                        var id = i;
                        Achievements(id, master, message, embed)
                        success = true
                    }
                }
                if(success == false){
                    message.channel.send(`Use "!achievements help" for a list of commands`)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in achievements.js");
        }   
    }
}

function Achievements(user, master, message, embed){
    const fs = require('fs')
    const Discord = require('discord.js')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var list = []
    for(i in achievements){
        if(master[user].achievements.includes(parseInt(i)) == true){
            list.push(achievements[i].name)
        }
    }
    const achievement_embed = new Discord.RichEmbed()
    .setTitle(`${master[user].name}'s Achievements`)
    .setDescription(list)
    .setColor(embed.Color(message))
    message.channel.send(achievement_embed)
    
}