module.exports = {
    name: 'stats',
    description: 'shows stats of player',
    execute(message,args, master){
        const fs = require('fs');
        const Discord = require('discord.js');
        const embed = require('./Functions/embed_functions')
        achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
        stats = JSON.parse(fs.readFileSync("./JSON/stats.json", "utf-8"))
        var user = message.author.id;
        var name = args[1];
        var success = false;
        
        try{

            if(typeof(name) == 'undefined'){
                for(i in master){
                    if(user == i){
                        Stats(user, stats, master, message, embed)
                    }
                }
            }else if(name.toLowerCase() == 'all'){
                Stats_All(stats, message, embed)
            }else{
                for(i in master){
                    if(master[i].name.toLowerCase() === name.toLowerCase()){
                        var id = i;
                        Stats(id, stats, master, message, embed)
                        success = true
                    }
                }
                if(success == false){
                    message.channel.send(`Use "!stats [name]" to check a persons stats or "!stats" to check your own`)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in stats.js");
        }   
    }
}

function Stats(user, stats, master, message, embed){
    const fs = require('fs')
    const Discord = require('discord.js')
    const achievements_list = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var achievements = master[user].achievements.length
    var total_achievements = Object.keys(achievements_list).length
    var achievements_ratio = `${achievements}/${total_achievements}`
    const Stats_list = new Discord.RichEmbed()
    .setTitle(`${stats[user].name} Stat List`)
    .setColor(embed.Color(message))
    .setDescription([
        `Total Messages: ${stats[user].total_msgs}`,
        `Total Commands: ${stats[user].total_commands}`,
        `Total Non-Farm Messages: ${stats[user].non_farm_messages}`,
        `Total Farm Messages: ${stats[user].farm_messages}`,
        `Blackjack Wins: ${stats[user].bj_wins}`,
        `Blackjack Pushes: ${stats[user].bj_pushes}`,
        `Blackjack Losses: ${stats[user].bj_losses}`,
        `Guessgame Wins: ${stats[user].gg_wins}`,
        `Guessgame Losses: ${stats[user].gg_losses}`,
        `Powerball Tickets bought: ${stats[user].lottery_tickets}`,
        `Achievements: ${achievements_ratio}`
    ])
    message.channel.send(Stats_list)
}

function Stats_All(stats, message, embed){
    const fs = require('fs')
    const Discord = require('discord.js')
    var lottery_tickets = 0
    var bj_wins = 0
    var bj_pushes = 0
    var bj_losses = 0
    var gg_wins = 0
    var gg_losses = 0
    var total_msgs = 0
    var total_commands = 0
    var farm_messages = 0
    var non_farm_messages = 0
    for(i in stats){
        lottery_tickets = lottery_tickets + stats[i].lottery_tickets
        bj_wins = bj_wins + stats[i].bj_wins
        bj_pushes = bj_pushes + stats[i].bj_pushes
        bj_losses = bj_losses + stats[i].bj_losses
        gg_wins = gg_wins + stats[i].gg_wins
        gg_losses = gg_losses + stats[i].gg_losses
        total_msgs = total_msgs + stats[i].total_msgs
        total_commands = total_commands + stats[i].total_commands
        farm_messages = farm_messages + stats[i].farm_messages
        non_farm_messages = non_farm_messages + stats[i].non_farm_messages
    }
    const Stats_list = new Discord.RichEmbed()
    .setTitle(`All Stats List`)
    .setColor(embed.Color(message))
    .setDescription([
        `Total Messages: ${total_msgs}`,
        `Total Commands: ${total_commands}`,
        `Total Non-Farm Messages: ${non_farm_messages}`,
        `Total Farm Messages: ${farm_messages}`,
        `Blackjack Wins: ${bj_wins}`,
        `Blackjack Pushes ${bj_pushes}`,
        `Blackjack Losses: ${bj_losses}`,
        `Guessgame Wins: ${gg_wins}`,
        `Guessgame Loses: ${gg_losses}`,
        `Powerball Tickets bought: ${lottery_tickets}`
    ])
    message.channel.send(Stats_list)
}


