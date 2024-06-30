module.exports = {
    name: 'names',
    description: 'lists all names on the server',
    execute(message,master){
        const embed = require('./Functions/embed_functions')
        var justNames = [];
        var counter = 0

        try{
            for(var i in master){
                justNames[counter] = master[i].name
                counter = counter + 1
            }
            //turns each pair into an object array

            var title = "List of all names on the Server"
            var description = justNames
            var fields = embed.emptyValue
            const embedMessage = embed.EmbedCreator(message, title, description, fields)
            message.channel.send({embeds: [embedMessage]})

        }catch(err){
            console.log(err)
            message.channel.send("Error Occurred in Names.js");
        }
    }
}
