module.exports = {
    name: 'button',
    description: 'Either gives you 50 gbp or -1500 gbp on use',
    execute(message, args, master, stats_list, tracker, command_stats){
        const fs = require('fs')
        if(!args[1]){
            try{
                ButtonPress(message, master, stats_list, tracker, command_stats)
            }catch(err){
                console.log(err)
                message.channel.send('Error occurred in button.js')
            }
        }else if(args[1].toLowerCase() == 'stats'){
            try{
                ButtonStats(message, command_stats)
            }catch(err){
                console.log(err)
                message.channel.send('Error occurred in button.js stats')
            }
        }else if(args[1].toLowerCase() == 'help'){
            try{
                ButtonHelp(message)
            }catch(err){
                console.log(err)
                message.channel.send('Error occurred in button.js help')
            }
            
        }else{
            message.channel.send(`Use "!button help" for a list of commands`)
        }
    }
}
function ButtonPress(message, master, stats_list, tracker, commmand_stats){
    const fs = require('fs')
    const unlock = require('./Functions/Achievement_Functions')
    var chance = Math.floor(Math.random() * 10)
    var user = message.author.id
    var win = 100
    var lose = 1000
    //console.log(chance)
    /*
    For testing
    var test_win = 0
    var test_loss = 0
    for(i = 0; i < 10000; i ++){
        var test_chance = Math.floor(Math.random() * 10)
        if(test_chance == 5){
            test_loss = test_loss + 1
        }else{
            test_win = test_win + 1
        }
    }
    console.log(["wins", test_win, "losses",test_loss])
    */
    if(chance == 5){
        master[user].gbp = master[user].gbp - lose
        command_stats.button.Total_Losses = command_stats.button.Total_Losses + 1
        command_stats.button.Last_loss = 0
        stats_list[user].button_losses += 1
        message.channel.send(`You lose ${lose} gbp`)
    }else{
        master[user].gbp = master[user].gbp + win
        command_stats.button.Last_loss = command_stats.button.Last_loss + 1
        message.channel.send(`You win ${win} gbp`)
    }
    stats_list[user].button_presses = stats_list[user].button_presses + 1
    command_stats.button.Total_Presses = command_stats.button.Total_Presses + 1
    
    //Wyatt Achievement
    unlock.tracker1(message.author.id, 44, 1, message, master, tracker)
}

function ButtonStats(message, command_stats){
    const Discord = require('discord.js')
    const fs = require('fs')
    const embed = require('./Functions/embed_functions')
    var stats_embed = new Discord.MessageEmbed()
    .setTitle('Button Stats')
    .setDescription(`Total Presses: ${command_stats.button.Total_Presses} \nPresses since last loss: ${command_stats.button.Last_loss} \nTotal Losses: ${command_stats.button.Total_Losses}`)
    .setColor(embed.Color(message))
    message.channel.send(stats_embed)
}

function ButtonHelp(message){
    const Discord = require('discord.js')
    const fs = require('fs')
    const embed = require('./Functions/embed_functions')
    var help_embed = new Discord.MessageEmbed()
    .setTitle('!button Commands')
    .setDescription("The Button has a 90% chance of giving you 100 gbp but a 10% chance of taking 1000 gbp")
    .addField('Commands', ['!button: Pushes the button', '!button stats: Shows you stats relating to the button'])
    .setColor(embed.Color(message))
    message.channel.send(help_embed)
}