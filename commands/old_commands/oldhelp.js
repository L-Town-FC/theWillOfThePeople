module.exports = {
    name: 'oldhelp',
    description: 'gives list of commands',
    execute(message,args){
        try{
            var fs = require('fs');
            const Discord = require('discord.js');
            const embed = require('../Functions/embed_functions')
            var help_commands_1 = fs.readFileSync('./text_files/help/help1.txt','utf8');
            var help_commands_2 = fs.readFileSync('./text_files/help/help2.txt','utf8')
            const help_embed1 = new Discord.MessageEmbed()
            .addField('List of Commands', help_commands_1)
            .setColor(embed.Color(message))
            const help_embed2 = new Discord.MessageEmbed()
            .addField('List of Commands Pg.2', help_commands_2)
            .setColor(embed.Color(message))
            message.channel.send(help_embed1);
            message.channel.send(help_embed2);
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Help.js");
        }
    }

}