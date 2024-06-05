module.exports = {
    name: 'help',
    description: 'Gives you a list of all commands',
    execute(message, args){
        const fs = require('fs')
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        const help = JSON.parse(fs.readFileSync('./JSON/help.json', 'utf-8'))
        var length = Object.keys(help).length
        try{
            if(!args[1]){
                HelpEmbed(message, help)
            }else if(parseInt(args[1]) == parseFloat(args[1]) && args[1] > 0 && args[1] <= length){
                // var help_embed = new Discord.MessageEmbed()
                // .setTitle(`**${help[args[1]].name}**`)
                // .setDescription(help[args[1]].description)
                // .setColor(embed.Color(message))
                // if(help[args[1]].rules !== ""){
                //     help_embed.addField('**Commands**', help[args[1]].rules)
                // }
                // message.channel.send(help_embed)
                CommandHelpEmbed(message, help, args)
            }else{
                message.channel.send('Use !help for a list of all commands. Use !help [command number] for a more detailed list of the specified command')
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occured in help.js')
        }
    }
}

function HelpEmbed(message, helpJSON){
    const embed = require('./Functions/embed_functions')

    var list = ""

    for(i in helpJSON){
        list += `${i}. ${helpJSON[i].name}\n`
    }

    var title = "List of Commands"
    var description = `Use "!help [number]" for more detailed list of specificied command`
    var fields = {name: "Commands", value: list}
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({ embeds: [embedMessage] });
    return
}

function CommandHelpEmbed(message, helpJSON, args){
    const embed = require('./Functions/embed_functions')
    var title = `**${helpJSON[args[1]].name}**`
    var description = helpJSON[args[1]].description
    var fields = {name: '**Commands**', value: ""}
    if(helpJSON[args[1]].rules !== ""){
        var temp = ""
        for(var i in helpJSON[args[1]].rules){
            temp += helpJSON[args[1]].rules[i] + "\n"
        }
        fields.value = temp

    }else{
        fields = embed.emptyValue
    }
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})
    return
}