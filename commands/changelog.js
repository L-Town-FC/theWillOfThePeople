module.exports = {
    name: 'changelog',
    description: 'gives list of changes that were made in previous update',
    execute(message){
        try{
            var fs = require('fs');
            const embed = require('./Functions/embed_functions')
            var changelog = fs.readFileSync('./text_files/changelog/changelog.txt','utf8');
            //var changelog2 = fs.readFileSync('./text_files/changelog/changelog2.txt','utf8');


            var fields1 = { name: '**List of Changes', value: changelog}
            //var fields2 = {name: '**List of Changes', value: changelog2}

            const embedMessage1 = embed.EmbedCreator(message, embed.emptyValue, embed.emptyValue, fields1)
            //const embedMessage2 = embed.EmbedCreator(message, embed.emptyValue, embed.emptyValue, fields2)

            message.channel.send({embeds: [embedMessage1]})
            //message.channel.send({embeds: [embedMessage2]})

        }catch(err){
            console.log(err)
            message.channel.send("Error Occurred in Changelog.js");
        }
    }
}