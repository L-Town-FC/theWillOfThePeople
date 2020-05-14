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

var test ="";

bot.on('message', message =>{
    bot.commands.get('simmerdowncount').execute(message);
    bot.commands.get('herald_counter').execute(message,test);
    bot.commands.get('alex_insults').execute(message);
    bot.commands.get('more_money').execute(message);
    //console.log(message)
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
                bot.commands.get('21').execute(message,args,total_money(message.author.discriminator));
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
            case 'insults':
                bot.commands.get('insults').execute(message,args,total_money(message.author.discriminator));
            break;
            case 'delete':
                bot.commands.get('delete').execute(message,args,total_money(message.author.discriminator));
            break;
            case 'guessgame':
                bot.commands.get('guessgame').execute(message,args,total_money(message.author.discriminator));
            break;
            case 'transfer':
                bot.commands.get('transfer').execute(message,args,total_money(message.author.discriminator));
            break;
            case 'kumiko':
                bot.commands.get('kumiko').execute(message,args,total_money(message.author.discriminator));
            break;
            case 'lottery':
                bot.commands.get('lottery').execute(message,args, total_money(message.author.discriminator))
            break;
            case 'herald':
                bot.commands.get('herald').execute(message,args, total_money(message.author.discriminator))
            break;
            case 'help':
                bot.commands.get('help').execute(message);
            break;
            default:
                message.channel.send('Use command !help for a list of commands');
        }
    }

})

bot.login(token);


function total_money(person) {
    var total_money = "";
    var user_money = [];
    var array = [];
    var holdings = fs.readFileSync('./text_files/currency.txt','utf8');
    var user_and_currency = holdings.split(",");
    for (i = 0; i < user_and_currency.length; i++) {
        user_money[i] = user_and_currency[i].split(" ");
    }
    //breaks .txt into individual person/money pairs

    for (i = 0; i < user_money.length; i++) {
        array[i] = {discrim: user_money[i][0],
                    name: user_money[i][1],
                    money: user_money[i][2]}
    }

    for (i = 0; i < array.length; i++){
        if (array[i].discrim == person){
            total_money = array[i].money;
            return total_money
        }
    }
}