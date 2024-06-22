module.exports = {
    name: 'button',
    description: 'Either gives you 50 gbp or -1500 gbp on use',
    execute(message, args, master, stats_list, tracker, command_stats, buttonJSON){
        if(!args[1]){
            try{
                //ButtonPress(message, master, stats_list, tracker, command_stats)
                newButtonPress(message, buttonJSON)
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
    const unlock = require('./Functions/Achievement_Functions')
    var chance = Math.floor(Math.random() * 10)
    var user = message.author.id
    var win = 100
    var lose = 1000

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

function newButtonPress(message, buttonJSON){
    const {ButtonBuilder, ButtonStyle, ActionRowBuilder,ComponentType} = require('discord.js')
    var maxSessionLengthInSeconds = 15

    const embed = require('./Functions/embed_functions')
    const firstButton = new ButtonBuilder()
    .setLabel('Button')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('button')

    const secondButton = new ButtonBuilder()
    .setLabel('Big Button')
    .setStyle(ButtonStyle.Danger)
    .setCustomId('bigButton')

    setTimeout(function(){
        firstButton.setDisabled(true)
        secondButton.setDisabled(true)
    },1000)

    const buttonRow = new ActionRowBuilder().addComponents(firstButton, secondButton);
    var buttonPresserID = String(message.author.id)

    message.reply({content: 'Choose a button', components: [buttonRow]}).then((msg) => {
        if(buttonJSON[buttonPresserID] == null){
            var author = buttonPresserID
            Object.assign(buttonJSON, {
                [author] : {
                    currentSessionAmount: 0,
                    currentMessageID: msg.id,
                }
            })
        }else{
            buttonJSON[buttonPresserID].currentMessageID = msg.id
            buttonJSON[buttonPresserID].currentSessionAmount = 0
        }

        setTimeout(function(){
            firstButton.setDisabled(true)
            secondButton.setDisabled(true)

            var title = "Current Button Session"
            var description = [`Total GBP earned: ${buttonJSON[buttonPresserID].currentSessionAmount}`, "Session has timed out. Use !button to start a new session"]

            const embedMessage = embed.EmbedCreator(msg, title, description, embed.emptyValue)
            msg.edit({embeds: [embedMessage], components: [buttonRow]})
        },maxSessionLengthInSeconds * 1000)
    })
}

function ButtonStats(message, command_stats){
    const embed = require('./Functions/embed_functions')
    var title = "Button Stats"
    var description = `Total Presses: ${command_stats.button.Total_Presses} \nPresses since last loss: ${command_stats.button.Last_loss} \nTotal Losses: ${command_stats.button.Total_Losses}`
    const embedMessage = embed.EmbedCreator(message, title, description, embed.emptyValue)
    message.channel.send({ embeds: [embedMessage] });
    return
}

function ButtonHelp(message){
    const embed = require('./Functions/embed_functions')
    var title = "!button Commands"
    var description = "The Button has a 90% chance of giving you 100 gbp but a 10% chance of taking 1000 gbp. The BIG button has a 70% change to give you 1000 gbp and a 30% change to take 10000 gbp"
    var fields = {name: "Commands", value: '!button: Brings up the Button \n!button stats: Shows you stats relating to the button'}
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({ embeds: [embedMessage] });
    return
}