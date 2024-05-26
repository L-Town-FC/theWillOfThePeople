module.exports = {
    name: 'pug',
    description: 'randomly generates pug pic',
    execute(message, master, tracker){
        const {Discord, Attachment, MessageAttachment} = require('discord.js');
        const fs = require('fs')
        const unlock = require('./Functions/Achievement_Functions')
        const dir = './pug_pics'
        var max_pugs = fs.readdirSync(dir).length
        var pug = Math.floor(Math.random()*max_pugs);
        //console.log(pug)
        //var pug = 2;


        try{
            var pug_image = new MessageAttachment(`./pug_pics/${fs.readdirSync(dir)[pug]}`)
            message.channel.send(pug_image)
            //Master Pugilist Achievmement
            unlock.tracker1(message.author.id, 5, 1, message, master, tracker)
        }catch(err){
            console.log(err)
            message.channel.send("Error Occurred in Pug.js");
        }
    }
}
