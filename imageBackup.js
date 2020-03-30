const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NjY4OTk2NzU1MjExMjg4NTk1.XiZbSw.vNF0MTfQtIqqNrSu-4bmZ6gZJko';
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
    
    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'ping':
            bot.commands.get('ping').execute(message,args);
        break;
        case 'pug':
            image(message)
        break;

    }

})

function image(message){
 
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "pug",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };
 
 
 
 
 
    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }
 
 
        $ = cheerio.load(responseBody);
 
 
        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
       
        console.log(urls);
 
        if (!urls.length) {
           
            return;
        }
 
        // Send result
        message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
    });
 
 
 
 
 
 
 
 
}


bot.login(token);
