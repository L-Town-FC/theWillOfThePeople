module.exports = {
    name: 'button',
    description: 'Either gives you 50 gbp or -1500 gbp on use',
    execute(message, args, master, stats_list, tracker){
        const fs = require('fs')
        var button_stats = JSON.parse(fs.readFileSync('./JSON/button_stats.json', 'utf-8'))
        if(!args[1]){
            try{
                ButtonPress(message, master, stats_list, tracker, button_stats)
            }catch(err){
                console.log(err)
                message.channel.send('Error occurred in button.js')
            }
        }else if(args[1].toLowerCase() == 'stats'){
            try{
                ButtonStats(message, button_stats)
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
function ButtonPress(message, master, stats_list, tracker, button_stats){
    const fs = require('fs')
    var chance = Math.floor(Math.random() * 10)
    var user = message.author.id
    var win = 100
    var lose = 1000
    console.log(chance)
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
        button_stats.Total_Losses = button_stats.Total_Losses + 1
        button_stats.Last_loss = 0
        message.channel.send(`You lose ${lose} gbp`)
    }else{
        master[user].gbp = master[user].gbp + win
        button_stats.Last_loss = button_stats.Last_loss + 1
        message.channel.send(`You win ${win} gbp`)
    }
    stats_list[user].button_presses = stats_list[user].button_presses + 1
    button_stats.Total_Presses = button_stats.Total_Presses + 1

    fs.writeFileSync ("./JSON/button_stats.json", JSON.stringify(button_stats, null, 2), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}

function ButtonStats(message, button_stats){
    const Discord = require('discord.js')
    const fs = require('fs')
    const embed = require('./Functions/embed_functions')
    var stats_embed = new Discord.RichEmbed()
    .setTitle('Button Stats')
    .setDescription(`Total Presses: ${button_stats.Total_Presses} \nPresses since last loss: ${button_stats.Last_loss} \nTotal Losses: ${button_stats.Total_Losses}`)
    .setColor(embed.Color(message))
    message.channel.send(stats_embed)
}

function ButtonHelp(message){
    const Discord = require('discord.js')
    const fs = require('fs')
    const embed = require('./Functions/embed_functions')
    var help_embed = new Discord.RichEmbed()
    .setTitle('!button Commands')
    .setDescription("The Button has a 90% chance of giving you 100 gbp but a 10% chance of taking 1000 gbp")
    .addField('Commands', ['!button: Pushes the button', '!button stats: Shows you stats relating to the button'])
    .setColor(embed.Color(message))
    message.channel.send(help_embed)
}