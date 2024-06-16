module.exports = {
    name: 'msg',
    description: 'lets you anonymously dm people through the bot',
    execute(message, args, master,bot){
        const unlock =require('./Functions/Achievement_Functions')
        const Discord = require('discord.js')
        const general = require('./Functions/GeneralFunctions')
        try{
            var name = args[1] || 'none'
            var price = 50
            
            var targetID = general.NameToUserID(name.toLowerCase(), master)

            if(name.toLowerCase() == "help"){
                Prices(message)
            }

            //validates if the user is able to use the command with the specified target
            if(!general.CommandUsageValidator(message, master, price, price, master[message.author.id].gbp, targetID)){
                return
            }

            var recipient = bot.users.cache.find(user => user.id == targetID)
            var newMsg = ConstructingNewMessage(args)

            if(newMsg == ""){
                message.channel.send("You can't send an empty message")
                return
            }

            if(newMsg.startsWith("!")){
                message.channel.send("You can't send someone a command")
                return
            }

            if(message.attachments.size > 1){
                message.channel.send("You can't send more than 1 attachment")
                return
            }

            general.CommandPurchase(message, master, price, general.defaultRecipient)

            if(message.attachments.size == 1){
                var image = new Discord.AttachmentBuilder(message.attachments.first().url)
                recipient.send({content: newMsg, files: [image]})
                return
            }

            if(message.author.id == targetID){
                //Schizophrenic Achievement
                unlock.unlock(message.author.id, 45, message, master)
            }

            recipient.send(newMsg)
            return

        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in msg.js')
        }
    }
}

function ConstructingNewMessage(args){
    var cut_args = args.splice(2, args.length - 2)
    var new_msg = ""
    for(var i = 0; i < cut_args.length; i++){
        new_msg += cut_args[i] + " "
    }

    return new_msg
}

function Prices(message){
    const embed = require('./Functions/embed_functions')

    var title = "!msg Help"
    var description = ["Messages cost 50 gbp", "You can only attach one image per message"]
    var fields = embed.emptyValue
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})
}