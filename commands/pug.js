module.exports = {
    name: 'pug',
    description: 'randomly generates pug pic',
    execute(message, master, tracker){
        const {AttachmentBuilder} = require('discord.js');
        const fs = require('fs')
        const unlock = require('./Functions/Achievement_Functions')
        const dir = './pug_pics'
        var maxPugs = fs.readdirSync(dir).length
        var pug = Math.floor(Math.random()*maxPugs);

        try{
            var pugImage = `./pug_pics/${fs.readdirSync(dir)[pug]}`
            const file = new AttachmentBuilder(pugImage)
            message.channel.send({files: [file] });

            //Master Pugilist Achievmement
            unlock.tracker1(message.author.id, 5, 1, message, master, tracker)
        }catch(err){
            console.log(err)
            message.channel.send("Error Occurred in Pug.js");
        }
    }
}

