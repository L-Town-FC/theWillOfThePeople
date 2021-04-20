const { parse } = require('path');

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
            }else if(name.toLowerCase() == 'help'){
                command = 'help'
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
                        switch(achievements[args[2]].tracker){
                            case 1:
                                Achievement_Tracker1(message, args[2], master, tracker)
                            break;
                            case 2:
                                Achievement_Tracker2(message, args[2], master, tracker)
                            break;
                            case 3:
                                Achievement_Tracker3(message, args[2], master, tracker)
                            break;
                            default:
                                Achievement_Tracker(message, args[2], master, tracker)
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
                    var help = fs.readFileSync('./text_files/achievement_commands.txt', 'utf-8')
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

function Achievement_Tracker(message, achievement_num, master, tracker){
    //Gives bar for achievements that only track 1 number
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    if(master[message.author.id].achievements.includes(parseInt(achievement_num))== true){
        var hasAchievement = 1
    }else{
        var hasAchievement = 0
    }
    
    const bar_length = 64
    var bar = "["
    for(var i = 0; i < bar_length; i++){
        if(i == bar_length/4 || i == bar_length/2 || i == bar_length * 3/4){
            bar += '|'
        }else
        if(hasAchievement == 1){
            bar += 'l'
        }else{
            bar += '.'
        }
    }
    bar += ']'
    var description
    if(achievements[achievement_num].secret == true && hasAchievement == 0){
        description = 'Secret Achievement'
    }else{
        description = achievements[achievement_num].description
    }

    var achievement = new Discord.RichEmbed()
    .setTitle(`${achievements[achievement_num].name}`)
    .setColor(embed.Color(message))
    .setDescription(description)
    .addField(`Progress: (${hasAchievement}/${1})`, bar)
    message.channel.send(achievement)
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
    const bar_length = 64

    if(master[message.author.id].achievements.includes(parseInt(achievement_num)) == true){
        current = threshold
    }

    var ratio = Math.floor((current/threshold) * bar_length)
    var bar = "["
    for(var i = 0; i < bar_length; i++){
        if(i == bar_length/4 || i == bar_length/2 || i == bar_length * 3/4){
            bar += '|'
        }else
        if(i < ratio){
            bar += 'l'
        }else{
            bar += '.'
        }
    }
    bar += ']'
    var description
    if(achievements[achievement_num].secret == true && master[message.author.id].achievements.includes(parseInt(achievement_num)) == false){
        description = 'Secret Achievement'
    }else{
        description = achievements[achievement_num].description
    }

    var achievement = new Discord.RichEmbed()
    .setTitle(`${achievements[achievement_num].name}`)
    .setColor(embed.Color(message))
    .setDescription(description)
    .addField(`Progress: (${current}/${threshold})`, bar)
    /*
    .setDescription(bar)
    .addField('Progress:', `(${current}/${threshold})`)
    .addField('Description', description)
    */
    message.channel.send(achievement)
}

function Achievement_Tracker2(message, achievement_num, master, tracker){
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var total = tracker[message.author.id][achievement_num].length
    var counter = 0
    for(var j in tracker[message.author.id][achievement_num]){
        if(tracker[message.author.id][achievement_num][j] == true){
            counter++
        }
    }

    if(master[message.author.id].achievements.includes(parseInt(achievement_num))== true){
        counter = total
    }

    const bar_length = 64
    var ratio = Math.floor((counter/total) * bar_length)
    var bar = "["
    for(var i = 0; i < bar_length; i++){
        if(i == bar_length/4 || i == bar_length/2 || i == bar_length * 3/4){
            bar += '|'
        }else
        if(i < ratio){
            bar += 'l'
        }else{
            bar += '.'
        }
    }
    bar += ']'

    var description
    if(achievements[achievement_num].secret == true && master[message.author.id].achievements.includes(parseInt(achievement_num))== false){
        description = 'Secret Achievement'
    }else{
        description = achievements[achievement_num].description
    }

    var achievement = new Discord.RichEmbed()
    .setTitle(`${achievements[achievement_num].name}`)
    .setColor(embed.Color(message))
    .setDescription(bar)
    .addField('Progress:', `(${counter}/${total})`)
    .addField('Description', description)
    message.channel.send(achievement)
}

function Achievement_Tracker3(message, achievement_num, master, tracker){
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var total = tracker[message.author.id][achievement_num].length
    var threshold = achievements[achievement_num].threshold
    const bar_length = 64
    var achievement = new Discord.RichEmbed()
    var current = []
    var counter = 0
    var list = []
    for(var j = 0; j < total; j++){
        current[j] = tracker[message.author.id][achievement_num][j]
        if(current[j] >= threshold){
            current[j] = threshold
            counter++
        }
        //console.log(current/threshold)
        var ratio = Math.floor((current[j]/threshold) * bar_length)
        list[j] = "["
        for(var k = 0; k < bar_length; k++){
            if(k == bar_length/4 || k == bar_length/2 || k == bar_length * 3/4){
                list[j] += '|'
            }else
            if(k < ratio){
                list[j] += 'l'
            }else{
                list[j] += '.'
            }
        }
        list[j] += ']'
        console.log(list[j])
        achievement.addField(`${achievements[achievement_num].labels[j]}: (${current[j]}/${threshold})`, list[j])
    }
    //console.log(list)
    var description
    if(achievements[achievement_num].secret == true){
        description = 'Secret Achievement'
    }else{
        description = achievements[achievement_num].description
    }

    achievement
    .setTitle(`${achievements[achievement_num].name}`)
    .setColor(embed.Color(message))
    .setDescription(description)
    message.channel.send(achievement)

}