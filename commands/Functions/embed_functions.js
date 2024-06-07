emptyValue = "emptyValue"
module.exports.emptyValue = emptyValue

//grabs the users color and sets the embeds color to match the users
//if no color is detected it defaults to black
function Color(message){
    if(message.member !== null){
        return message.member.roles.color.color
    }else{
        return 0o0
    }
}

module.exports.Color = Color

function EmbedCreator(message, title, description, fields){
    const Discord = require("discord.js")

    const embededMessage = new Discord.EmbedBuilder()

    //sets the title of the embedded message
    if(title != emptyValue){
        embededMessage.setTitle(title)
    }

    //sets the description of the embedded message
    if(description != emptyValue){
        //used to check if description is a string array because its directly taken from a text file
        if(typeof(description) == 'object'){
            var temp = ""
            for (let i = 0; i < description.length; i++) {
                temp += description[i] +"\n";
            }
            description = temp
        }
        embededMessage.setDescription(description)
    }

    //set the fields of the embedded message
    if(fields != emptyValue){
        if(fields.length > 1){
            for (var i = 0; i < fields.length; i++) {
                embededMessage.addFields(fields[i])
            }
        }else{

            embededMessage.setFields(fields)
        }
    }

    //sets the color of the embedded message based on the users name color
    embededMessage.setColor(Color(message))

    console.log(embededMessage)

    return embededMessage
}

module.exports.EmbedCreator = EmbedCreator