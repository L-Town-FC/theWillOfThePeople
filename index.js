const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.BOTTOKEN;
const PREFIX = "!";
if(typeof(daily_counter) == 'undefined'){
    daily_counter = 0
}

const fs = require('fs');
bot.commands = new Discord.Collection();

const stats = require('./commands/Functions/stats_functions');
const unlock = require('./commands/Functions/Achievement_Functions')
master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
stats_list = JSON.parse(fs.readFileSync("./JSON/stats.json", "utf-8"))
tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}


bot.on('ready', () => {
    var channel = bot.channels.find(channel => channel.id === '590585423202484227')
    console.log('This bot is online')
    if(!daily_counter){
        daily_counter = 0
    }
    setInterval(function(){
        daily_counter = daily_counter + 1
        if(daily_counter >= 24){
            daily_counter = 0
            Welfare(channel, master)
            Lottery(channel, master, unlock)
            gbp_farm_reset(channel)
        }
    }, 3600 * 1000)
    //3600
    //590585423202484227 - pugilism
    //611276436145438769 - test
})

bot.on('message', message =>{
    try{
        if(message.author.bot == false){
            bot.commands.get('simmerdowncount').execute(message, master);
            bot.commands.get('insult_counter').execute(message, master, tracker);
            bot.commands.get('boo_trigger').execute(message);
            bot.commands.get('more_money').execute(message, master, stats_list, tracker);
            bot.commands.get('bwg_counter').execute(message, master, tracker);
            bot.commands.get('ceelo_counter').execute(message, master)
            if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){
                stats.tracker(message.author.id, 7, 1, stats_list)
            }

            ['712755269863473252', '611276436145438769'].includes(message.channel.id) == true
            if(typeof(bets_open) !== 'undefined' && ['712755269863473252', '611276436145438769'].includes(message.channel.id) == true){
                Roulette_bets(message, master[message.author.id].gbp, master)
            }
        }
        //console.log(message)
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in message parser")
    }
})


bot.on('message', message =>{
    
    try{
        let args = message.content.substring(PREFIX.length).split(" ");
        if (message.content.startsWith("!") == true){
            if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){
                stats.tracker(message.author.id, 8, 1, stats_list)
            }
            switch(args[0].toLowerCase()){
                case 'ping':
                    bot.commands.get('ping').execute(message);
                break;
                case 'pug':
                    bot.commands.get('pug').execute(message,master, tracker); 
                break;
                case 'simmerdown':
                    bot.commands.get('simmerdown').execute(message,args, master);    
                break;
                case '21':
                    bot.commands.get('21').execute(message,args,master[message.author.id].gbp, master, stats_list, tracker);
                break;
                case 'flip':
                    bot.commands.get('flip').execute(message, master, tracker);
                break;
                case 'council':
                    bot.commands.get('council').execute(message,master,tracker);
                break;
                case 'assblast':
                    bot.commands.get('assblast').execute(message,args);
                break;
                case 'bank':
                    bot.commands.get('bank').execute(message,args, master);
                break;
                case 'insults':
                    bot.commands.get('insults').execute(message,args,master[message.author.id].gbp, master, tracker);
                break;
                case 'delete':
                    bot.commands.get('delete').execute(message,args,master[message.author.id].gbp, master, tracker);
                break;
                case 'gg':
                    bot.commands.get('gg').execute(message,args,master[message.author.id].gbp, master, stats_list, tracker);
                break;
                case 'transfer':
                    bot.commands.get('transfer').execute(message,args,master[message.author.id].gbp, master);
                break;
                case 'kumiko':
                    bot.commands.get('kumiko').execute(message,master[message.author.id].gbp, master, tracker);
                break;
                case 'powerball':
                    bot.commands.get('powerball').execute(message,args, master[message.author.id].gbp, master, stats_list, tracker)
                break;
                case 'herald':
                    bot.commands.get('herald').execute(message,args, master[message.author.id].gbp, master)
                break;
                case 'names':
                    bot.commands.get('names').execute(message,master)
                break;
                case 'master':
                    bot.commands.get('master').execute(message,args)
                break;
                case 'roles':
                    bot.commands.get('roles').execute(message, args, master)
                break;
                case 'changelog':
                    bot.commands.get('changelog').execute(message)
                break;
                case 'roulette':
                    bot.commands.get('roulette').execute(message,args,master, tracker, Roulette_bets(message, master[message.author.id].gbp, master))
                break;
                case 'help':
                    bot.commands.get('help').execute(message, args);
                break;
                case 'set':
                    bot.commands.get('set').execute(message,args, master);
                break;
                case 'boo':
                    bot.commands.get('boo').execute(message,args,master[message.author.id].gbp, master, tracker);
                break;
                case 'steal':
                    bot.commands.get('steal').execute(message,args,master[message.author.id].gbp, master, tracker);
                break;
                case 'backup':
                    bot.commands.get('backup').execute(message,args);
                break;
                case 'achievements':
                    bot.commands.get('achievements').execute(message,args, master, tracker);
                break;
                case 'bwg':
                    bot.commands.get('bwg').execute(message,args, master[message.author.id].gbp, master)
                break;
                case 'stats':
                    bot.commands.get('stats').execute(message,args, master);
                break;
                case 'button':
                    bot.commands.get('button').execute(message,args, master, stats_list, tracker);
                break;
                case 'loan':
                    bot.commands.get('loan').execute(message,args, master);
                break;
                case 'ceelo':
                    bot.commands.get('ceelo').execute(message, args, master, stats_list, tracker)
                break;
                case 'test':
                    bot.commands.get('test').execute(message, master, stats_list, tracker);
                break;
                default:
                    message.channel.send('Use command !help for a list of commands');
            }
        }
        
        //Only time Major JSONs should be overwritten
        if(message.author.bot == false){
            setTimeout(function(){
                JSON_Overwrite(master, stats_list, tracker, message)
            },50)
        }

    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Index.js Comand Handler");
    }

})

bot.login(token);

function Welfare(channel, master){
    const fs = require('fs')
    var loans = []
    try{
        for(i in master){
            if(isNaN(master[i].gbp) == true){
                master[i].gbp = 0;
            }
            if(master[i].loans.target !== ""){
                loans.push([i, master[i].loans.target])
            }
            if(master[i].gbp + master[i].account < 0){
                master[i].gbp = master[i].gbp + 250
            }else if(master[i].gbp + master[i].account < 250){
                master[i].gbp = 250 - parseFloat(master[i].account)
            }
            if(master[i].loans.collection !== 0){
                master[i].loans.collection -= 1
            }
        }
        for(var i = 0; i < loans.length; i ++){
            if(master[loans[i][0]].loans.collection == 0){
                if(master[loans[i][0]].loans.remaining >= master[loans[i][1]].gbp){
                    master[loans[i][0]].loans.remaining -= master[loans[i][1]].gbp
                    master[loans[i][0]].gbp += master[loans[i][1]].gbp
                    master[loans[i][1]].gbp -= master[loans[i].gbp] 
                }else{
                    master[loans[i][1]].gbp -= master[loans[i][0]].loans.remaining
                    master[loans[i][0]].gbp += master[loans[i][0]].loans.remaining
                    master[loans[i][0]].loans.remaining = 0
                }
                if(master[loans[i][0]].loans.remaining <= 0){
                    channel.send(`${master[loans[i][1]].name} has payed off their loan`)
                    master[loans[i][0]].loans = {
                        target: "",
                        remaining: 0,
                        collection: 0,
                        rate: 0
                    }
                }
                if(isNaN(master[loans[i][1]].gbp) == true){
                    master[loans[i][1]].gbp = 0
                }
            }
        }
        
        channel.send("Welfare has been distributed")
        fs.writeFile ("./JSON/master.json", JSON.stringify(master, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        channel.send('Error Occured in Welfare')
    }
}

function Roulette_bets(message, money, master){
    var args = message.content.split(" ")
    var possible_bets = fs.readFileSync('./text_files/roulette/roulette_bets','utf-8').split(",")
    var min_bet = 10;
    var bet = false

    try{
        if(typeof(approved_bets) == 'undefined'){
            approved_bets = []
        }

        if(isNaN(args[0]) == false && args[0] >= min_bet){
            if(possible_bets.includes(args[1].toLowerCase()) == true){
                if(money >= args[0]){
                    purchase(args[0], message.author.id, master)
                    var bet = [args[0], args[1], message.author.id]
                    approved_bets.push(bet)
                    message.channel.send(`${master[message.author.id].name} Bet accepted`)
                    if(Math.round(money) == args[0] && money >= 1000){
                        unlock.unlock(message.author.id, 38, message, master)
                    }
                }else{
                    message.channel.send(`${master[message.author.id].name} doesn't have enough gbp for that bet`)
                }
                
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error Occured in Roulette_bets.js')
    }
}

function purchase(bet_value, player, master) {
    try{
        master[player].gbp = parseFloat(master[player].gbp) - parseFloat(bet_value)

    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Index.js Purchase");
    }
}

function Lottery(channel, master, unlock){
    const fs = require('fs')
    odds = 250
    var number = Math.ceil(Math.random()*odds);
    var pot = 1000
    var success = false
    channel.send("The Daily Lottery Drawing is occuring...")
    for(i in master){
        var guess = Math.ceil(Math.random()*odds);
        if(guess == number){
            master[i].gbp = pot + master[i].gbp
            channel.send(`Congratulations! ${master[i].name} won the Daily lottery of ${pot} gbp`)
            unlock.index_unlock(i, 10, channel, master)
            success = true
        }
    }
    if(success == false){
        channel.send('No winners')
    }
}
function JSON_Overwrite(master, stats_list, tracker, message){
    try{
        //master["450001712305143869"].loans.collection = 0
        fs.writeFile ("./JSON/master.json", JSON.stringify(master, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
        fs.writeFileSync ("./JSON/stats.json", JSON.stringify(stats_list, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
        fs.writeFileSync ("./JSON/achievements_tracker.json", JSON.stringify(tracker, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        message.channel.send('Error Occured in JSON_Overwrite')
    }
}

function gbp_farm_reset(channel){
    var gbp_farmed = JSON.parse(fs.readFileSync("./JSON/gbp_farmer.json", "utf-8"))
    var deletes = JSON.parse(fs.readFileSync("./JSON/delete_tracker.json", "utf-8"))
    try{
        for(i in gbp_farmed){
            gbp_farmed[i].farmed = 0
        }
        for(i in deletes){
            deletes[i].deletes = 0
        }
        fs.writeFileSync ("./JSON/gbp_farmer.json", JSON.stringify(gbp_farmed, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
        fs.writeFileSync ("./JSON/delete_tracker.json", JSON.stringify(deletes, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        channel.send("Error occurred in gbp_farm_reset")
    }
}