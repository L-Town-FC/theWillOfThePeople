module.exports = {
    name: 'roles',
    description: 'roles',
    execute(message, master){
        const Discord = require('discord.js');
        const embed = require('./Functions/embed_functions')
        const ROLES = ["The People's Representative", "Senior Representative Assistant","Junior Representative Assistant", "Dog Catcher", "Soup Maker", "Cocksucka", "Viceroy"] 
        const ROLEIDs = ['590576332350685194', '590579566448476170', '590586818462875671','669019379077218314', '669019512548491274', '710177280160432138', '771535782283837450'] //ids corresponding to the above roles
        //const ROLEIDs = ['713061699548217354', '729813954435612792', 590586818462875671, 669019379077218314, 669019512548491274, 710177280160432138, 771535782283837450] //test role ids
        var ROLEOWNERS = ["None", "None", "None", "None", "None", "None", "None"] //default role owner is noone
        try{

            //loop over each member of the server
            //loop over the roles of each server member
            //check if any of those roles id match array of roles ids
            //if they do add their name to role owener sheet to be printed later
            message.guild.members.cache.forEach(element => {

                for (let i = 0; i < ROLEIDs.length; i++) {
                    if(element._roles.includes(ROLEIDs[i])){
                        var temp = element.id
                        ROLEOWNERS[i] = master[temp].name
                        return
                    }
                }
            });
            var rolesList = []
            for(var i in ROLEOWNERS){
                rolesList.push(`${i}. ${ROLES[i]} - ${ROLEOWNERS[i]}`)
            }

            var title = embed.emptyValue
            var description = embed.emptyValue
            var fields = {name: 'List of Electable Roles', value: rolesList }
            console.log(fields)
            const embedMessage = embed.EmbedCreator(message, title, description, fields)
            message.channel.send({ embeds: [embedMessage] });

        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in Roles.js");
        }
    }
}