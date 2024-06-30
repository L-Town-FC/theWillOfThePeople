module.exports = {
    name: 'stats',
    description: 'shows stats of player',
    execute(message,args, master, stats){
        const general = require('./Functions/GeneralFunctions')
        var user = message.author.id;
        var name = args[1];
        
        try{
            if(typeof(name) == 'undefined'){
                Stats(user, stats, master, message)
            }else if(name.toLowerCase() == 'all'){
                Stats_All(stats, message)
            }else{
                var targetID = general.NameToUserID(name.toLowerCase(), master)
                if(targetID == general.invalid){
                    message.channel.send("User does not exist")
                    return
                }
                
                Stats(targetID, stats, master, message)
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in stats.js");
        }   
    }
}

function Stats(user, stats, master, message){
    const fs = require('fs')
    const achievements_list = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
    const embded = require('./Functions/embed_functions')
    var achievements = master[user].achievements.length
    var total_achievements = Object.keys(achievements_list).length
    var achievements_ratio = `${achievements}/${total_achievements}`

    var title = `${stats[user].name} Stat List`
    var description = [
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
        `Button Presses: ${stats[user].button_presses}`,
        `Button Losses: ${stats[user].button_losses}`,
        `Roulette Bets Placed: ${stats[user].roulette_bets}`,
        `Roulette Bets Won: ${stats[user].roulette_wins}`,
        `Achievements: ${achievements_ratio}`
    ]

    var fields = embded.emptyValue

    var chance = Math.floor(Math.random() * 10)
    if(chance == 5){
        fields = {name: '===============', value: 'END OF MESSAGE \n==============='}
    }
    const embedMessage = embded.EmbedCreator(message, title, description, fields)
    message.channel.send({ embeds: [embedMessage] });
}

function Stats_All(stats, message){
    const embded = require('./Functions/embed_functions')
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
    var button_presses = 0
    var button_losses = 0
    var roulette_bets = 0
    var roulette_wins = 0
    for(var i in stats){
        lottery_tickets = lottery_tickets + stats[i].lottery_tickets
        bj_wins = bj_wins + stats[i].bj_wins
        bj_pushes = bj_pushes + stats[i].bj_pushes
        bj_losses = bj_losses + stats[i].bj_losses
        gg_wins += stats[i].gg_wins
        gg_losses += stats[i].gg_losses
        total_msgs += stats[i].total_msgs
        total_commands += stats[i].total_commands
        farm_messages += stats[i].farm_messages
        non_farm_messages += stats[i].non_farm_messages
        button_presses += stats[i].button_presses
        button_losses += stats[i].button_losses
        roulette_bets += stats[i].roulette_bets
        roulette_wins += stats[i].roulette_wins
    }

    var title = `All Stats List`
    var description = [
        `Total Messages: ${total_msgs}`,
        `Total Commands: ${total_commands}`,
        `Total Non-Farm Messages: ${non_farm_messages}`,
        `Total Farm Messages: ${farm_messages}`,
        `Blackjack Wins: ${bj_wins}`,
        `Blackjack Pushes ${bj_pushes}`,
        `Blackjack Losses: ${bj_losses}`,
        `Guessgame Wins: ${gg_wins}`,
        `Guessgame Loses: ${gg_losses}`,
        `Powerball Tickets bought: ${lottery_tickets}`,
        `Button Presses: ${button_presses}`,
        `Button Losses: ${button_losses}`,
        `Roulette Bets Placed: ${roulette_bets}`,
        `Roulette Bets Won: ${roulette_wins}`,
    ]

    var fields = embded.emptyValue

    var chance = Math.floor(Math.random() * 10)
    if(chance == 5){
        fields = {name: '===============', value: 'END OF MESSAGE \n==============='}
    }


    const embedMessage = embded.EmbedCreator(message, title, description, fields)
    message.channel.send({ embeds: [embedMessage] });
}
