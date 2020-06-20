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
    .setDescription(`Total Messages: ${stats[user].total_msgs} \nTotal Commands: ${stats[user].total_commands} \nBlackjack Wins: ${stats[user].bj_wins} \nBlackjack Losses: ${stats[user].bj_losses}\nGuessgame Wins: ${stats[user].gg_wins}\nGuessgame Loses: ${stats[user].gg_loses}\nLottery Tickets bought: ${stats[user].lottery_tickets}\nAchievements: ${achievements_ratio}`)
    message.channel.send(Stats_list)

}


