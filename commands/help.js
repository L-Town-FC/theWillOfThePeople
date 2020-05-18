module.exports = {
    name: 'help',
    description: 'gives list of commands',
    execute(message,args){
        try{
            var fs = require('fs');
            const Discord = require('discord.js');
            var help_commands = fs.readFileSync('./text_files/help.txt','utf8');
            const help_embed = new Discord.RichEmbed()
            .addField('List of Commands', help_commands);
            message.channel.send(help_embed);
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Help.js");
        }
    }

}