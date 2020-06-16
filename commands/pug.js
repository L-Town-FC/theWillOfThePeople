module.exports = {
    name: 'pug',
    description: 'randomly generates pug pic',
    execute(message,args){
        const {Discord, Attachment} = require('discord.js');
        const fs = require('fs')
        const unlock = require('./Functions/Achievement_Functions')
        master = JSON.parse(fs.readFileSync('./JSON/master.json', "utf-8"))
        var max_pugs = 53;
        var pug = Math.ceil(Math.random()*max_pugs);
        //console.log(pug)
        //var pug = 2;


        try{
            var pug_image = new Attachment('./pug_pics/pug'+ pug +'.jpg')
            message.channel.send(pug_image)
            unlock.tracker1(message.author.id, 5, 1, 25, message, master)
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Pug.js");
        }
    }
}
