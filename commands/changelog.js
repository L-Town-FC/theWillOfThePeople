module.exports = {
    name: 'changelog',
    description: 'gives list of changes that were made in previous update',
    execute(message,args){
        try{
            var fs = require('fs');
            const Discord = require('discord.js');
            var changelog = fs.readFileSync('./text_files/changelog.txt','utf8');
            var changelog2 = fs.readFileSync('./text_files/changelog2.txt','utf8');
            const help_embed = new Discord.RichEmbed()
            .addField('List of Changes', changelog);
            const help_embed2 = new Discord.RichEmbed()
            .addField('List of Changes Pg. 2', changelog2)
            message.channel.send(help_embed);
            message.channel.send(help_embed2)
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Changelog.js");
        }
    }

}