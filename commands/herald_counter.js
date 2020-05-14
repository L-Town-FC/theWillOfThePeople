module.exports = {
    name: 'herald_counter',
    description: 'gets a herald to relay your message',
    execute(message){
        const fs = require('fs');
        var counter_discrim = fs.readFileSync('./text_files/herald_counter.txt','utf8').split(",");

        if(message.author.discriminator == counter_discrim[1]){
            if(message.content.startsWith("!") == false){
                if(message.attachments.array().length == 0){                
                    message.channel.bulkDelete(1);
                    message.channel.send(message.cleanContent)
                    counter_discrim[0] = parseInt(counter_discrim[0]) - 1
                    if (counter_discrim[0] == 0){
                        fs.writeFileSync('./text_files/herald_counter.txt', "0,0")
                        message.channel.send("Your Herald paid trial has ended")
                    }else{
                        fs.writeFileSync('./text_files/herald_counter.txt', counter_discrim)
                    }
                }else if(message.cleanContent == ""){
                    image = message.attachments.array()[0].proxyURL;
                    message.channel.bulkDelete(1);
                    message.channel.send(message.cleanContent)
                    message.channel.send(image);
                    counter_discrim[0] = parseInt(counter_discrim[0]) - 1
                    if (counter_discrim[0] == 0){
                        fs.writeFileSync('./text_files/herald_counter.txt', "0,0")
                        message.channel.send("Your Herald paid trial has ended")
                    }else{
                        fs.writeFileSync('./text_files/herald_counter.txt', counter_discrim)
                    }
                }else{
                    image = message.attachments.array()[0].proxyURL;
                    message.channel.bulkDelete(1);
                    message.channel.send(message.cleanContent)
                    message.channel.send(image)
                    counter_discrim[0] = parseInt(counter_discrim[0]) - 1
                    if (counter_discrim[0] == 0){
                        fs.writeFileSync('./text_files/herald_counter.txt', "0,0")
                        message.channel.send("Your Herald paid trial has ended")
                    }else{
                        fs.writeFileSync('./text_files/herald_counter.txt', counter_discrim)
                    }
                }
            }
        }
    }
}