bot.on('message', msg =>{
    if (msg.content === "Hello"){
        msg.reply('Hello Fag!');
    }

})


bot.on('message', msg =>{
    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'ping':
            message.reply('pong'); //For Directed Reply
            message.channel.sendMessage('pong!') // For non-reply
        break;

    }

})

case 'info': // if/else example
    if(args[1] ==='version'){
        message.channel.sendMessage('Version 1.10');
    }else{
        message.channel.sendMessage('Invalid args')
    }
}

case 'clear': // Mass deletes message
            if(!args[1]) return message.reply('Error')
            message.channel.bulkDelete(args[1]);
            break;

            bot.on('message', message =>{
    
                if (message.author === bot.user){
            
                } else{
                    if (message.author.discriminator = 4682){
                        if (name_count !== 1){
                            name_count = name_count + 1
                        }else{
                            message.channel.send('fag')
                            name_count = 0
                        }
            
                    }
                }
            
            
            }
            )
