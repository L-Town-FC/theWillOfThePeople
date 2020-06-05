module.exports = {
    name: 'kumiko',
    description: 'randomly generates kumiko pic',
    execute(message,args ,money){
        const {Discord, Attachment} = require('discord.js');
        const cheerio = require('cheerio');
        const request = require('request');
        const fs = require('fs');
        var max_kumikos = 60
        var kumiko = Math.ceil(Math.random()*max_kumikos);
        var price = 20

        try{
            if(money < price){
                message.channel.send(`It costs ${price} gbp to use this command`)
            }else{
                var kumiko_image = new Attachment('./kumiko_pics/kumiko'+ kumiko +'.jpg')
                message.channel.send(kumiko_image)
                purchase(price, message.author.id, message) 
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Kumiko.js");
        }
            
        }
}

function purchase(bet_value, player, message) {
    try{
        const fs = require('fs');
        var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))

        for(i in master){
            if(player == i){
                master[i].gbp = parseFloat(master[i].gbp) - parseFloat(bet_value)
            }
        }

        fs.writeFileSync ("master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );

    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Kumiko.js");
    }
}