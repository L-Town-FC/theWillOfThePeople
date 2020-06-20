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
    var channel = bot.channels.find(channel => channel.id === '611276436145438769')
    console.log('This bot is online')
    setInterval(function(){
        Welfare(channel)
    }, 86400 * 1000)
})

bot.on('message', message =>{
    try{
        bot.commands.get('simmerdowncount').execute(message);
        bot.commands.get('insult_counter').execute(message);
        bot.commands.get('boo_trigger').execute(message);
        bot.commands.get('more_money').execute(message);
        bot.commands.get('bwg_counter').execute(message);
        //console.log(message)
    }catch(err){
        console.log(err)
        message.channel.send("Error occured in message parser")
    }
})


bot.on('message', message =>{

    try{
        let args = message.content.substring(PREFIX.length).split(" ");
        if (message.content.startsWith("!") == true){
            switch(args[0].toLowerCase()){
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
                    bot.commands.get('21').execute(message,args,total_money(message.author.id));
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
                    bot.commands.get('insults').execute(message,args,total_money(message.author.id));
                break;
                case 'delete':
                    bot.commands.get('delete').execute(message,args,total_money(message.author.id));
                break;
                case 'gg':
                    bot.commands.get('gg').execute(message,args,total_money(message.author.id));
                break;
                case 'transfer':
                    bot.commands.get('transfer').execute(message,args,total_money(message.author.id));
                break;
                case 'kumiko':
                    bot.commands.get('kumiko').execute(message,args,total_money(message.author.id));//
                break;
                case 'lottery':
                    bot.commands.get('lottery').execute(message,args, total_money(message.author.id))
                break;
                case 'herald':
                    bot.commands.get('herald').execute(message,args, total_money(message.author.id))
                break;
                case 'names':
                    bot.commands.get('names').execute(message,args)
                break;
                case 'master':
                    bot.commands.get('master').execute(message,args)
                break;
                case 'roles':
                    bot.commands.get('roles').execute(message, args)
                break;
                case 'changelog':
                    bot.commands.get('changelog').execute(message)
                break;
                case 'reserves':
                    bot.commands.get('reserves').execute(message,args)
                break;
                case 'help':
                    bot.commands.get('help').execute(message);
                break;
                case 'set':
                    bot.commands.get('set').execute(message,args);
                break;
                case 'boo':
                    bot.commands.get('boo').execute(message,args,total_money(message.author.id));
                break;
                case 'steal':
                    bot.commands.get('steal').execute(message,args,total_money(message.author.id));
                break;
                case 'backup':
                    bot.commands.get('backup').execute(message,args);
                break;
                case 'achievements':
                    bot.commands.get('achievements').execute(message,args);
                break;
                case 'bwg':
                    bot.commands.get('bwg').execute(message,args, total_money(message.author.id))
                break;
                case 'stats':
                    bot.commands.get('stats').execute(message,args);
                break;
                case 'test':
                    bot.commands.get('test').execute(message,args);
                break;
                default:
                    message.channel.send('Use command !help for a list of commands');
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Index.js Comand Handler");
    }

})

bot.login(token);


function total_money(person) {
    try{
        const fs = require('fs')
        var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        
        for(i in master){
            if(person == i){
                return master[i].gbp
            }
        }

    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Index.js Total_Money");
    }
}

function Welfare(channel){
    const fs = require('fs')
    master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))

    for(i in master){
        if(master[i].gbp < 250){
            master[i].gbp = 250
        }
    }
    channel.send("Welfare has been distributed")
    fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}
