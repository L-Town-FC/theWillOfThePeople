module.exports = {
    name: 'newhelp',
    description: 'Gives you a list of all commands',
    execute(message, args){
        const fs = require('fs')
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        const help = JSON.parse(fs.readFileSync('./JSON/help.json', 'utf-8'))
        var length = Object.keys(help).length
        var test = 0
        
        if(!args[1] || parseInt(args[1]) !== parseFloat(args[1]) || args[1] <= 0 || args[1] > length){
            var list = []
            for(i in help){
                list.push(`${i}. ${help[i].name}`)
            }
            var help_embed = new Discord.RichEmbed()
            .setTitle('List of Commands')
            .setDescription(list)
            .setColor(embed.Color(message))
            message.channel.send(help_embed)
        }else{
            var help_embed = new Discord.RichEmbed()
            .setTitle(`***${help[args[1]].name}***`)
            .setDescription(help[args[1]].description)
            .setColor(embed.Color(message))
            if(help[args[1]].rules !== ""){
                help_embed.addField('***Commands***', help[args[1]].rules)
            }
            message.channel.send(help_embed)
        }
    }
}