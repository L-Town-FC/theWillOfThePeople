module.exports = {
    name: 'stats',
    description: 'shows stats of player',
    execute(message,args){
        const fs = require('fs');
        const Discord = require('discord.js');
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
        stats = JSON.parse(fs.readFileSync("./JSON/stats.json", "utf-8"))
        var user = message.author.id;
        var name = args[1];
        var success = false;
        
        try{

            if(typeof(name) == 'undefined'){
                for(i in master){
                    if(user == i){
                        Stats(user, stats, master, message)
                    }
                }
            }else if(name.toLowerCase() == 'all'){
                Stats_All(stats, message)
            }else{
                for(i in master){
                    if(master[i].name.toLowerCase() === name.toLowerCase()){
                        var id = i;
                        Stats(id, stats, master, message)
                        success = true
                    }
                }
                if(success == false){
                    message.channel.send(`Use "!stats [name]" to check a persons stats or "!stats" to check your own`)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in stats.js");
        }   
    }
}

function Stats(user, stats, master, message){
    const fs = require('fs')
    const Discord = require('discord.js')
    const achievements_list = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    var achievements = master[user].achievements.length
    var total_achievements = Object.keys(achievements_list).length
    var achievements_ratio = `${achievements}/${total_achievements}`
    const Stats_list = new Discord.RichEmbed()
    .setTitle(`${stats[user].name} Stat List`)
    .setDescription(`Total Messages: ${stats[user].total_msgs} \nTotal Commands: ${stats[user].total_commands} \nBlackjack Wins: ${stats[user].bj_wins} \nBlackjack Losses: ${stats[user].bj_losses}\nGuessgame Wins: ${stats[user].gg_wins}\nGuessgame Losses: ${stats[user].gg_losses}\nLottery Tickets bought: ${stats[user].lottery_tickets}\nAchievements: ${achievements_ratio}`)
    message.channel.send(Stats_list)
}

function Stats_All(stats, message){
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
    for(i in stats){
        lottery_tickets = lottery_tickets + stats[i].lottery_tickets
        bj_wins = bj_wins + stats[i].bj_wins
        bj_pushes = bj_pushes + stats[i].bj_pushes
        bj_losses = bj_losses + stats[i].bj_losses
        gg_wins = gg_wins + stats[i].gg_wins
        gg_losses = gg_losses + stats[i].gg_losses
        total_msgs = total_msgs + stats[i].total_msgs
        total_commands = total_commands + stats[i].total_commands
    }
    const Stats_list = new Discord.RichEmbed()
    .setTitle(`All Stats List`)
    .setDescription(`Total Messages: ${total_msgs} \nTotal Commands: ${total_commands} \nBlackjack Wins: ${bj_wins} \nBlackjack Losses: ${bj_losses}\nGuessgame Wins: ${gg_wins}\nGuessgame Loses: ${gg_losses}\nLottery Tickets bought: ${lottery_tickets}`)
    message.channel.send(Stats_list)
}


