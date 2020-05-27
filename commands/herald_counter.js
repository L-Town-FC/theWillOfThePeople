module.exports = {
    name: 'herald_counter',
    description: 'gets a herald to relay your message',
    execute(message){


        try{

        const fs = require('fs');
        const Discord = require('discord.js');
        var counter_discrim = fs.readFileSync('./text_files/herald_counter.txt','utf8').split(",");
        var description = message.cleanContent;

        if(message.author.discriminator == counter_discrim[1]){
            if(message.content.startsWith("!") == false){
                if(message.attachments.array().length == 0){                
                    message.channel.bulkDelete(1);
                    const message_embed = new Discord.RichEmbed()
                    .setTitle(`Important Decree from His Excellency ${name(message.author.discriminator)}`)
                    .setDescription(description)
                    .setAuthor("------------------------------------------------------------",message.author.displayAvatarURL)
                    .setFooter("By the Suprme Leader's grace. May he help us live our most fulfilled lives");
                    message.channel.send(` @everyone Hear ye, hear ye. Would'st thou all gather round for a message that our beloved ${name(message.author.discriminator)} hath decided you should know and is as follows`)
                    message.channel.send(message_embed);
                    counter_discrim[0] = parseInt(counter_discrim[0]) - 1
                    if (counter_discrim[0] == 0){
                        fs.writeFileSync('./text_files/herald_counter.txt', "0,0")
                        message.channel.send("Your Herald paid trial has ended")
                    }else{
                        fs.writeFileSync('./text_files/herald_counter.txt', counter_discrim)
                    }
                }else{
                   /*
                    console.log(test)
                    const message_embed = new Discord.RichEmbed()
                    
                    .setTitle(`Important Decree from His Excellency ${name(message.author.discriminator)}`)
                    .setDescription(message.cleanContent)
                    .setAuthor("------------------------------------------------------------",message.author.displayAvatarURL)
                    .setImage(fs.readFileSync('test.txt', 'utf8'))
                    message.channel.bulkDelete(1);
                    message.channel.send(message_embed);
                    counter_discrim[0] = parseInt(counter_discrim[0]) - 1
                    if (counter_discrim[0] == 0){
                        fs.writeFileSync('./text_files/herald_counter.txt', "0,0")
                        message.channel.send("Your Herald paid trial has ended")
                    }else{
                        fs.writeFileSync('./text_files/herald_counter.txt', counter_discrim) 
                    } */
                } 
            }
        }

    }catch (error){
        console.log(err)
        message.channel.send("Error Occured in herald_counter.js");
    }

    }
}

function name(player){
    try{
        const fs = require('fs');
        const Discord = require('discord.js');
        var user_and_currency = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
        var user_money = [];
        var array = [];

        for (i = 0; i < user_and_currency.length; i++) {
            user_money[i] = user_and_currency[i].split(" ");
        }
        //breaks .txt into individual person/money pairs
        for (i = 0; i < user_money.length; i++) {
            array[i] = {discrim: user_money[i][0],
                        name: user_money[i][1],
                        money: user_money[i][2]}
        }
        //turns each pair into an object array
        for (i = 0; i < array.length; i++) {
            if (array[i].discrim === player){
                return array[i].name
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Herald_counter.js Names");
    }
}