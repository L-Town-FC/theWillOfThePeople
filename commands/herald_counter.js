module.exports = {
    name: 'herald_counter',
    description: 'gets a herald to relay your message',
    execute(message){
        try{
            const fs = require('fs');
            const Discord = require('discord.js');
            var counter_discrim = fs.readFileSync('./text_files/herald_counter.txt','utf8').split(",");
            var description = message.cleanContent;

            if(message.author.id == counter_discrim[1]){
                if(message.content.startsWith("!") == false){
                    if(message.attachments.array().length == 0){                
                        message.channel.bulkDelete(1);
                        const message_embed = new Discord.RichEmbed()
                        .setTitle(`Important Decree from His Excellency ${name(message.author.id)}`)
                        .setDescription(description)
                        .setAuthor("-----------------------------------------------------------",message.author.displayAvatarURL)
                        .setFooter("By the Suprme Leader's grace. May he help us live our most fulfilled lives");
                        message.channel.send(` @everyone Hear ye, hear ye. Would'st thou all gather round for a message that our beloved ${name(message.author.id)} hath decided you should know and is as follows:`)
                        message.channel.send(message_embed);
                        counter_discrim[0] = parseInt(counter_discrim[0]) - 1
                        if (counter_discrim[0] == 0){
                            fs.writeFileSync('./text_files/herald_counter.txt', "0,0")
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
        var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))

        for(i in master){
            if(player == i){
                return master[i].name
            }
        }

    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Herald.js Names");
    }
}