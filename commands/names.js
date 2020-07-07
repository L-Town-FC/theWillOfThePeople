module.exports = {
    name: 'names',
    description: 'lists all names on the server',
    execute(message,args){
        const fs = require('fs');
        const Discord = require('discord.js');
        const embed = require('./Functions/embed_functions')
        const master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        var just_names = [];
        var counter = 0

        try{
            for(i in master){
                just_names[counter] = master[i].name
                counter = counter + 1
            }
            //turns each pair into an object array

            const message_embed = new Discord.RichEmbed()
                .setTitle("List of all names on Server")
                .setDescription(just_names)
                .setColor(embed.Color(message))
            message.channel.send(message_embed)
        }catch(err){
            console.log(err)
                    message.channel.send("Error Occured in Names.js");
        }
    }
}
