module.exports = {
    name: 'roles',
    description: 'gives list of roles on the server',
    execute(message,args){
        try{
            var fs = require('fs');
            const Discord = require('discord.js');
            var roles = fs.readFileSync('./text_files/roles.txt','utf8');
            const help_embed = new Discord.RichEmbed()
            .addField('List of Electable Roles', roles);
            message.channel.send(help_embed);
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Roles.js");
        }
    }

}