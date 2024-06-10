module.exports = {
    name: 'achievements',
    description: 'shows achievements',
    execute(message,args, master, tracker){
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
        var user = message.author.id;
        var name = args[1] || 'none'; //if only "!achievements" is sent then it defaults to "none"
        var command = ""

        //Achievement Hunter Achievement
        unlock.tracker1(user, 43, 1, message, master, tracker)
        
        try{
            for(var i in master){
                if(name.toLowerCase() == master[i].name.toLowerCase()){
                    command = 'person'
                    user = i
                }
            }
            //can definitely simplify this
            if(name == 'none'){
                command = 'person'
            }else if(name.toLowerCase() == 'list'){
                command = 'list'
            }else if(name.toLowerCase() == 'help'){
                command = 'help'
            }

            switch(command){
                case 'person':
                    Achievements(user, master, message)
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
                        const embed = require("./Functions/embed_functions")
                        var title = "List of All Achievements"
                        var description = list;
                        var fields = {name: "Additional Info", value: 'To check individual achievemeents use "!achievements list [number]"'}
                        const embedMessage = embed.EmbedCreator(message, title, description, fields)
                        message.channel.send({embeds: [embedMessage]})
                        return
                    }
                break;
                case 'help':
                    var title = "List of Commands"
                    var description = fs.readFileSync('./text_files/achievement_commands.txt', 'utf-8')
                    const embedMessage = embed.EmbedCreator(message, title, description, embed.emptyValue)
                    message.channel.send({embed: embedMessage})

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

function Achievements(user, master, message){

    const fs = require('fs')
    const embed = require("./Functions/embed_functions")
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var list = []
    for(var i in achievements){
        if(master[user].achievements.includes(parseInt(i)) == true){
            list.push(achievements[i].name)
        }
    }

    var title = `${master[user].name}'s Achievements`
    var description = list;

    const embedMessage = embed.EmbedCreator(message, title, description, embed.emptyValue)
    message.channel.send({embeds: [embedMessage]})

    return
}

function Achievement_Tracker(message, achievement_num, master, tracker){
    //Gives bar for achievements that only track 1 number
    const embed = require('./Functions/embed_functions')
    const fs = require('fs')
    var current = 0
    var threshold = 1
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    if(master[message.author.id].achievements.includes(parseInt(achievement_num))== true){
        var hasAchievement = 1
        current = 1
        
    }else{
        var hasAchievement = 0
    }

    var bar = CreateProgressBar(current, threshold)
    var description
    if(achievements[achievement_num].secret == true && hasAchievement == 0){
        description = 'Secret Achievement'
    }else{
        description = achievements[achievement_num].description
    }

    var title = `${master[message.author.id].name}'s Achievements`
    //var description = list;
    var fields = {name: "Progress" + `(${hasAchievement}/${1})`, value: bar}
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})

    return
}

function Achievement_Tracker1(message, achievement_num, master, tracker){
    //Gives bar for achievements that only track 1 number
    const embed = require('./Functions/embed_functions')
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var threshold = achievements[achievement_num].threshold
    var current = tracker[message.author.id][achievement_num]
    if(current >= threshold){
        current = threshold
    }

    if(master[message.author.id].achievements.includes(parseInt(achievement_num)) == true){
        current = threshold
    }
    var bar = CreateProgressBar(current, threshold)
    var description
    if(achievements[achievement_num].secret == true && master[message.author.id].achievements.includes(parseInt(achievement_num)) == false){
        description = 'Secret Achievement'
    }else{
        description = achievements[achievement_num].description
    }

    var title = `${achievements[achievement_num].name}`

    var fields = {name: `Progress: (${current}/${threshold})`, value: bar}
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})

    return
}

function Achievement_Tracker2(message, achievement_num, master, tracker){
    const embed = require('./Functions/embed_functions')
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var threshold = tracker[message.author.id][achievement_num].length
    var current = 0
    for(var j in tracker[message.author.id][achievement_num]){
        if(tracker[message.author.id][achievement_num][j] == true){
            current++
        }
    }

    if(master[message.author.id].achievements.includes(parseInt(achievement_num))== true){
        current = threshold
    }

    var bar = CreateProgressBar(current, threshold)

    var description
    if(achievements[achievement_num].secret == true && master[message.author.id].achievements.includes(parseInt(achievement_num))== false){
        description = 'Secret Achievement'
    }else{
        description = achievements[achievement_num].description
    }

    var title = `${achievements[achievement_num].name}`
    var fields = [{name: "Progress" + ` (${current}/${threshold})`, value: bar}]
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})

    return
    
}

function Achievement_Tracker3(message, achievement_num, master, tracker){
    const embed = require('./Functions/embed_functions')
    const fs = require('fs')
    var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var total = tracker[message.author.id][achievement_num].length
    var threshold = achievements[achievement_num].threshold
    const bar_length = 64
    var fields = []
    var current = []
    var counter = 0
    var list = []
    var fieldsCounter = 0

    for(var j = 0; j < total; j++){
        current[j] = tracker[message.author.id][achievement_num][j]
        if(current[j] >= threshold){
            current[j] = threshold
            counter++
        }
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
        fields[fieldsCounter] = {name: `${achievements[achievement_num].labels[j]}: (${current[j]}/${threshold})`, value: list[j].toString()}
        fieldsCounter++
    }

    var description
    if(achievements[achievement_num].secret == true){
        description = 'Secret Achievement'
    }else{
        description = achievements[achievement_num].description
    }

    var title = `${achievements[achievement_num].name}`
    var description = description;
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})

    return
}

function CreateProgressBar(current, threshold){
    const bar_length = 64
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
    return bar
}