module.exports = {
    name: 'kumiko',
    description: 'randomly generates kumiko pic',
    execute(message, master, tracker){
        const {AttachmentBuilder} = require('discord.js');
        const geneal = require('./Functions/GeneralFunctions')
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        const dir = './kumiko_pics'
        var maxKumikos = fs.readdirSync(dir).length
        var kumiko = Math.floor(Math.random()*maxKumikos);
        var price = 15
        try{
            geneal.CommandPurchase(message, master, price, message.author.id)
            if(message.channel.id !== '711634711281401867'){
                var kumikoImage = `./kumiko_pics/${fs.readdirSync(dir)[kumiko]}`
                const file = new AttachmentBuilder(kumikoImage);
                message.channel.send({files: [file] });

                //Kumiko Connisseur Achievement
                unlock.tracker1(message.author.id, 14, 1, message, master, tracker)    
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in Kumiko.js");
        }
            
        }
}