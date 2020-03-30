const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.BOTTOKEN;
const PREFIX = "!";

const fs = require('fs');
bot.commands = new Discord.Collection();

const cheerio = require('cheerio');
const request = require('request');


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}


bot.on('ready', () => {
    console.log('This bot is online')
})


bot.on('message', message =>{
    bot.commands.get('simmerdowncount').execute(message);
    bot.commands.get('alex_insults').execute(message);
    //commands that parse all messages
})


bot.on('message', message =>{
    
    let args = message.content.substring(PREFIX.length).split(" ");
    if (message.content.startsWith("!") == true){
        switch(args[0]){
            case 'ping':
                bot.commands.get('ping').execute(message,args);
            break;
            case 'pug':
                bot.commands.get('pug').execute(message,args); 
            break;
            case 'simmerdown':
                bot.commands.get('simmerdown').execute(message,args);    
            break;
            case '21':
                bot.commands.get('21').execute(message,args);
            break;
            case 'flip':
                bot.commands.get('flip').execute(message,args);
            break;
            case 'council':
                bot.commands.get('council').execute(message,args);
            break;
            case 'assblast':
                bot.commands.get('assblast').execute(message,args);
            break;
            case 'bank':
                bot.commands.get('bank').execute(message,args);
            break;
            case 'help':
                bot.commands.get('help').execute(message);
            break;
        }
    }

})

bot.login(token);
