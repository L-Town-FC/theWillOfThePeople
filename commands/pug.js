module.exports = {
    name: 'pug',
    description: 'randomly generates pug pic',
    execute(message,args){
        const {Discord, Attachment} = require('discord.js');
        var max_pugs = 50;
        var pug = Math.ceil(Math.random()*max_pugs);
        //console.log(pug)
        //var pug = 2;


        try{
            var pug_image = new Attachment('./pug_pics/pug'+ pug +'.jpg')
            message.channel.send(pug_image)
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Pug.js");
        }
    }
}
