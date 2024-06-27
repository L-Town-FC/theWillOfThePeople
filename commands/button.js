module.exports = {
    name: 'button',
    description: 'Either gives you 50 gbp or -1500 gbp on use',
    execute(message, args, master, buttonJSON){

        if(!args[1]){
            try{
                //ButtonPress(message, master, stats_list, tracker, command_stats)
                ButtonPress(message, buttonJSON, master)
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

function ButtonPress(message, buttonJSON, master){
    const {ButtonBuilder, ButtonStyle, ActionRowBuilder,ComponentType} = require('discord.js')
    
    var maxSessionLengthInSeconds = 120

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

    var title = `${master[buttonPresserID].name} current Button Session`
    var description = [`Last Button Payout: 0`, `Total GBP earned: 0`, `Total button presses: ${buttonJSON[buttonPresserID].currenSessionPresses}`]
    var fields = [{name: "Button Payout", value: "90% chance for 100 gbp, 10% chance for -1000 gbp"}, {name: "Big Button Payout", value: "90% chance for 1000 gbp, 10% chance for -10000 gbp"}]

    const intialEmbedMessage = embed.EmbedCreator(message, title, description, fields)

    message.reply({embeds: [intialEmbedMessage], components: [buttonRow]}).then((msg) => {
        if(buttonJSON[buttonPresserID] == null){
            var author = buttonPresserID
            Object.assign(buttonJSON, {
                [author] : {
                    currentSessionAmount: 0,
                    currentMessageID: msg.id,
                    currenSessionPresses: 0
                }
            })
        }else{
            buttonJSON[buttonPresserID].currentMessageID = msg.id
            buttonJSON[buttonPresserID].currentSessionAmount = 0
            buttonJSON[buttonPresserID].currentSessionPresses = 0
        }

        setTimeout(function(){
            firstButton.setDisabled(true)
            secondButton.setDisabled(true)

            var title = `${master[buttonPresserID].name} Button Session Results`
            var description = [`Total GBP earned: ${buttonJSON[buttonPresserID].currentSessionAmount}`,`Total button presses: ${buttonJSON[buttonPresserID].currenSessionPresses}` ,"Session has timed out. Use !button to start a new session"]

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
    var description = "The Button has a 90% chance of giving you 100 gbp but a 10% chance of taking 1000 gbp. The BIG button has a 90% change to give you 1000 gbp and a 10% change to take 10000 gbp"
    var fields = {name: "Commands", value: '!button: Brings up the Button \n!button stats: Shows you stats relating to the button'}
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({ embeds: [embedMessage] });
    return
}