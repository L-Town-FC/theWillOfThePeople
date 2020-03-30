const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NjY4OTk2NzU1MjExMjg4NTk1.XiZbSw.vNF0MTfQtIqqNrSu-4bmZ6gZJko';

const PREFIX = "!";


bot.on('ready', () => {
    console.log('This bot is online')
})

bot.on('message', message =>{
    
    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'ping':
            message.channel.sendMessage('pong');
        break;
        case 'Alex':
            message.channel.sendMessage('Is a Fag')
        break;
        case 'info':
            if(args[1] ==='version'){
                message.channel.sendMessage('Version 1.10');
            }else{
                message.channel.sendMessage('Invalid args')
            }
        case 'clear':
            if(!args[1]) return message.reply('Error')
            message.channel.bulkDelete(args[1]);
            break;


    }

})


bot.login(token);
