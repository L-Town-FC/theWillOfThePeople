module.exports = {
    name: 'changelog',
    description: 'gives list of changes that were made in previous update',
    execute(message,args){
        try{
            var fs = require('fs');
            const Discord = require('discord.js');
            var changelog = fs.readFileSync('./text_files/changelog.txt','utf8');
            const help_embed = new Discord.RichEmbed()
            .addField('List of changes', changelog);
            message.channel.send(help_embed);
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Changelog.js");
        }
    }

}