module.exports = {
    name: 'help',
    description: 'Gives you a list of all commands',
    execute(message, args){
        const fs = require('fs')
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        const help = JSON.parse(fs.readFileSync('./JSON/help.json', 'utf-8'))
        var length = Object.keys(help).length
        
        if(!args[1]){
            var list = []
            for(i in help){
                list.push(`${i}. ${help[i].name}`)
            }
            var help_embed = new Discord.RichEmbed()
            .setTitle('List of Commands')
            .setDescription(`Use "!help [number]" for more detailed list of specificied command`)
            .addField(`Commands:`, list)
            .setColor(embed.Color(message))
            message.channel.send(help_embed)
        }else if(parseInt(args[1]) == parseFloat(args[1]) && args[1] > 0 && args[1] <= length){
            var help_embed = new Discord.RichEmbed()
            .setTitle(`**${help[args[1]].name}**`)
            .setDescription(help[args[1]].description)
            .setColor(embed.Color(message))
            if(help[args[1]].rules !== ""){
                help_embed.addField('**Commands**', help[args[1]].rules)
            }
            message.channel.send(help_embed)
        }else{
            message.channel.send('Use !help for a list of all commands. Use !help [command number] for a more detailed list of the specified command')
        }
    }
}