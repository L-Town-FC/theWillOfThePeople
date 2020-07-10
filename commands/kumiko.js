module.exports = {
    name: 'kumiko',
    description: 'randomly generates kumiko pic',
    execute(message,money, master){
        const {Discord, Attachment} = require('discord.js');
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        const dir = './kumiko_pics'
        var max_kumikos = fs.readdirSync(dir).length
        var kumiko = Math.ceil(Math.random()*max_kumikos);
        var price = 15

        try{
            if(money < price){
                message.channel.send(`It costs ${price} gbp to use this command`)
            }else{
                var kumiko_image = new Attachment('./kumiko_pics/kumiko'+ kumiko +'.jpg')
                purchase(price, message.author.id, message, master) 
                if(message.channel.id !== '711634711281401867'){
                    message.channel.send(kumiko_image)
                    unlock.tracker1(message.author.id, 14, 1, message, master)    
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Kumiko.js");
        }
            
        }
}

function purchase(bet_value, player, message, master) {
    try{
        const fs = require('fs');

        for(i in master){
            if(player == i){
                master[i].gbp = parseFloat(master[i].gbp) - parseFloat(bet_value)
            }
        }

        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );

    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Kumiko.js");
    }
}