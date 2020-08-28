module.exports = {
    name: 'newsteal',
    description: 'lets you steal and protect from being stolen from',
    execute(message, args, master, tracker){
        const fs = require('fs')
        const Discord = require('discord.js')
        var command = args[2] || 'none'

        switch(command){
            case 'person':
                Steal()
            break;
            case 'insurance':
                Insurance()
            break;
            case 'help':
                Help()
            break;
            case 'basics':
                Basics()
            break;
            default:
                message.channel.send(`Use "!steal help" for a list of commands`)
        }
    }
}

function Steal(message, master, tracker){

}

function Insurance(message, master){

}

function Help(message){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var commands = fs.readFileSync('./text_files/steal/steal_commands.txt','utf-8')
    var help_embed = new Discord.RichEmbed()
    .setTitle('List of Commands')
    .setColor(embed.Color(message))
    .setDescription(commands)
    message.channel.send(help_embed)
}

function Basics(message){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var basics = fs.readFileSync('./text_files/steal/steal_basics.txt','utf-8')
    var basics_embed = new Discord.RichEmbed()
    .setTitle('List of Commands')
    .setColor(embed.Color(message))
    .setDescription(basics)
    message.channel.send(basics_embed)
}