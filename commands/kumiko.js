module.exports = {
    name: 'kumiko',
    description: 'randomly generates kumiko pic',
    execute(message,money, master, tracker){
        const {Discord, Attachment} = require('discord.js');
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        const dir = './kumiko_pics'
        var max_kumikos = fs.readdirSync(dir).length
        var kumiko = Math.floor(Math.random()*max_kumikos);
        var price = 15
        try{
            var kumiko_image = new Attachment(`./kumiko_pics/${fs.readdirSync(dir)[kumiko]}`)
            purchase(price, message.author.id, message, master) 
            if(message.channel.id !== '711634711281401867'){
                message.channel.send(kumiko_image)
                unlock.tracker1(message.author.id, 14, 1, message, master, tracker)    
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in Kumiko.js");
        }
            
        }
}

function purchase(bet_value, player, message, master) {
    try{
        master[player].gbp = parseFloat(master[player].gbp) - parseFloat(bet_value)
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in Kumiko.js");
    }
}