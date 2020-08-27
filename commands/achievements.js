module.exports = {
    name: 'achievements',
    description: 'shows achievements',
    execute(message,args, master, tracker){
        const fs = require('fs');
        const Discord = require('discord.js');
        const embed = require('./Functions/embed_functions')
        const unlock = require('./Functions/Achievement_Functions')
        achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
        var user = message.author.id;
        var name = args[1] || 'none';
        var command = ""
        var success = false;
        unlock.tracker1(user, 45, 1, message, master, tracker)

        try{
            for(var i in master){
                if(name.toLowerCase() == master[i].name.toLowerCase()){
                    command = 'person'
                    user = i
                }
            }
            if(name == 'none'){
                command = 'person'
            }else if(name.toLowerCase() == 'list'){
                command = 'list'
            }
            switch(command){
                case 'person':
                    Achievements(user, master, message, embed)
                break;
                case 'list':
                    var list = []
                    var counter = 0
                    var all_achievements = []
                    for(var i in achievements){
                        list[counter] = `${i}. ${achievements[i].name}`
                        counter = counter + 1
                        all_achievements.push(i)
                    }
                    if(all_achievements.includes(String(args[2])) == true){
                        var tracker1 = [4,5,7,8,9,13,14,17,18,21,23,25,26,27,28,29,31,32,33,36,37,40,44,45]
                        //Special cases to look at 8,
                        var tracker2 = [15,20,42]
                        //check each tracker for unique bar
                        //If no tracker its either a full or an empty bar
                        if(tracker1.includes(args[2]) == true){

                        }else if(tracker2.includes(args[2]) == true){

                        }
                        var number = String(args[2])
                        Achievement_Tracker1(message, args[2], master, tracker)
                        switch(number){

                        }
                    }else{
                        var achievements_list = new Discord.RichEmbed()
                        .setTitle("List of All Achievements")
                        .setDescription(list)
                        .addField('Additional Info','To Check individual achievements use "!achievements list [number]"')
                        .setColor(embed.Color(message))
                        message.channel.send(achievements_list)
                    }
                break;
                case 'help':
                    var help = fs.readFileSync('./text_files/achievement_commands', 'utf-8')
                    var command_list = new Discord.RichEmbed()
                    .setTitle("List of Commands")
                    .setDescription(help)
                    .setColor(embed.Color(message))
                    message.channel.send(command_list)
                break;
                default:
                    message.channel.send('Use "!achievements help" for a list of commands')
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occurred in achievements.js");
        }   
    }
}

function Achievements(user, master, message, embed){
    const fs = require('fs')
    const Discord = require('discord.js')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var list = []
    for(var i in achievements){
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

function Achievement_Tracker1(message, achievement_num, master, tracker){
    //Gives bar for achievements that only track 1 number
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var threshold = achievements[achievement_num].threshold
    var current = tracker[message.author.id][achievement_num]
    if(current >= threshold){
        current = threshold
    }
    const bar_length = 79
    var ratio = Math.floor((current/threshold) * bar_length)
    var bar = "["
    for(var i = 0; i < bar_length; i++){
        if(i <= ratio){
            bar += 'l'
        }else{
            bar += '.'
        }
    }
    bar += ']'

    var achievement = new Discord.RichEmbed()
    .setTitle(`${achievements[achievement_num].name}`)
    .setColor(embed.Color(message))
    .setDescription(bar)
    .addField('Progress:', `(${current}/${threshold})`)
    message.channel.send(achievement)
}