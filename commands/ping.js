module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message, buttonJSON){
        message.channel.send('pong');
        
        Test(message, buttonJSON)
        
    }
}

function Test(message, buttonJSON){
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
