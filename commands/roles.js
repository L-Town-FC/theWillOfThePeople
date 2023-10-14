module.exports = {
    name: 'roles',
    description: 'roles',
    execute(message,args, master){
        const fs = require('fs')
        const unlock = require('./Functions/Achievement_Functions')
        const embed = require('./Functions/embed_functions')
        const ROLES = ["The People's Representative", "Senior Representative Assistant","Junior Representative Assistant", "Dog Catcher", "Soup Maker", "Cocksucka", "Viceroy"]
        const ROLEIDs = [590576332350685194, 590579566448476170, 590586818462875671, 669019379077218314, 669019512548491274, 710177280160432138, 771535782283837450]
        var ROLEOWNERS = ["None", "None", "None", "None", "None", "None", "None"]
        var roleIndex = 0
        try{
            const Discord = require('discord.js');
            const roles_embed = new Discord.MessageEmbed();

            message.guild.members.cache.forEach(element => {
                if(element._roles.includes(ROLES[roleIndex])){
                    ROLEOWNERS[roleIndex] = master[element.id]
                    roleIndex++
                    return
                }
            });
            var roles_list = []
            for(var i in ROLEOWNERS){
                roles_list.push(`${i}. ${ROLES[i]} - ${ROLEOWNERS[i]}`)
            }
            roles_embed.addField('List of Electable Roles', roles_list)
            .setColor(embed.Color(message))
            message.channel.send(roles_embed);

        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in Roles.js");
        }
    }
}