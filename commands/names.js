module.exports = {
    name: 'names',
    description: 'lists all names on the server',
    execute(message,master){
        const Discord = require('discord.js');
        const embed = require('./Functions/embed_functions')
        var just_names = [];
        var counter = 0

        try{
            for(i in master){
                just_names[counter] = master[i].name
                counter = counter + 1
            }
            //turns each pair into an object array

            const message_embed = new Discord.MessageEmbed()
                .setTitle("List of all names on Server")
                .setDescription(just_names)
                .setColor(embed.Color(message))
            message.channel.send(message_embed)
        }catch(err){
            console.log(err)
            message.channel.send("Error Occurred in Names.js");
        }
    }
}
