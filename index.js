const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.BOTTOKEN;
const PREFIX = "!";

const fs = require('fs');
const cron = require('cron')
bot.commands = new Discord.Collection();

const stats = require('./commands/Functions/stats_functions');
const unlock = require('./commands/Functions/Achievement_Functions');
master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
stats_list = JSON.parse(fs.readFileSync("./JSON/stats.json", "utf-8"))
tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
players = JSON.parse(fs.readFileSync("./JSON/RPG/players.json","utf-8"))
command_stats = JSON.parse(fs.readFileSync("./JSON/command_stats.json", "utf-8"))
reminder_list = JSON.parse(fs.readFileSync("./JSON/reminders.json", "utf-8"))
profiles = JSON.parse(fs.readFileSync("./JSON/fishes/fishing_profiles.json", "utf-8"))

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}


bot.on('ready', () => {
    var channel = bot.channels.find(channel => channel.id === '611276436145438769') || bot.channels.find(channel => channel.id === '590585423202484227')
    var stonks = bot.channels.find(channel => channel.id === '743269381768872087')
    var bot_tinkering = bot.channels.find(channel => channel.id === '611276436145438769') || bot.channels.find(channel => channel.id === '711634711281401867')
    
    console.log('This bot is online')
    stocks_open = false
    if(typeof(cron_job) == 'undefined'){
        cron_job = 'something'
        bot_tinkering.send('The bot is online')
        for(var i in reminder_list){
            if(reminder_list[i][3].length  == 0){
                delete reminder_list[i]
            }
        }
        fs.writeFileSync ("JSON/reminders.json", JSON.stringify(reminder_list, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
        new cron.CronJob('0 9 * * *', function(){
            Daily_Functions(channel, master, unlock)
            //590585423202484227 - pugilism
            //611276436145438769 - test
            //743269381768872087 - stonks
            //711634711281401867 bot-tinkering            
        }, null, true, 'America/New_York')
        new cron.CronJob('0 * * * *', function(){
            //'0 * * * * *'
            setTimeout(function(){
                JSON_Overwrite(master, stats_list, tracker, command_stats, players, bot_tinkering)
            },2000)
        }, null, true)
        new cron.CronJob('0 * * * *', function(){
            //reminder checker
            Reminder_Checker(bot, reminder_list)
        },null, true)
    }
})

bot.on('guildMemberRemove', member =>{
    try{
        var channel = bot.channels.find(channel => channel.id === '611276436145438769') || bot.channels.find(channel => channel.id === '590585423202484227')
        channel.send(`${master[member.id].name} has left the server`)
    }catch(err){
        console.log('Error occured in user remover log')
    }
})

bot.on('message', message =>{
    try{
        if(message.author.bot == false){
            bot.commands.get('more_money').execute(message, master, stats_list, tracker);
            bot.commands.get('simmerdowncount').execute(message, master);
            bot.commands.get('insults_counter').execute(message, master, tracker, stats_list);
            bot.commands.get('boo_trigger').execute(message, command_stats);
            bot.commands.get('bwg_counter').execute(message, master, tracker);
            bot.commands.get('word_checker').execute(message, master, tracker)
            //bot.commands.get('stonks').execute(message)
            if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){
                stats.tracker(message.author.id, 7, 1, stats_list)
            }

            ['712755269863473252', '611276436145438769'].includes(message.channel.id) == true
            if(typeof(bets_open) !== 'undefined' && ['712755269863473252', '611276436145438769'].includes(message.channel.id) == true){
                Roulette_bets(message, master[message.author.id].gbp, master, stats_list)
            }
        }
        //console.log(message)
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in message parser")
    }
})


bot.on('message', async message =>{    
    try{
        let args = message.content.substring(PREFIX.length).split(" ");
        if (message.content.startsWith("!") == true){
            if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){
                stats.tracker(message.author.id, 8, 1, stats_list)
            }
            switch(args[0].toLowerCase()){
                case 'ping':
                    bot.commands.get('ping').execute(message, bot);
                break;
                case 'pug':
                    bot.commands.get('pug').execute(message,master, tracker); 
                break;
                case 'simmerdown':
                    bot.commands.get('simmerdown').execute(message,args, master);    
                break;
                case '21':
                    bot.commands.get('21').execute(message,args,master[message.author.id].gbp, master, stats_list, tracker);
                    unlock.tracker1(message.author.id, 51, 1, message, master, tracker)
                break;
                case 'flip':
                    bot.commands.get('flip').execute(message, master, tracker);
                break;
                case 'council':
                    bot.commands.get('council').execute(message,master,tracker);
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
                    unlock.tracker1(message.author.id, 51, 1, message, master, tracker)
                break;
                case 'transfer':
                    bot.commands.get('transfer').execute(message,args,master[message.author.id].gbp, master);
                break;
                case 'kumiko':
                    bot.commands.get('kumiko').execute(message,master[message.author.id].gbp, master, tracker);
                break;
                case 'powerball':
                    bot.commands.get('powerball').execute(message,args, master[message.author.id].gbp, master, stats_list, tracker, command_stats)
                    unlock.tracker1(message.author.id, 51, 1, message, master, tracker)
                break;
                case 'names':
                    bot.commands.get('names').execute(message,master)
                break;
                case 'master':
                    bot.commands.get('master').execute(message,args, master, stats_list, tracker, command_stats, reminder_list)
                break;
                case 'roles':
                    bot.commands.get('roles').execute(message, args, master)
                break;
                case 'changelog':
                    bot.commands.get('changelog').execute(message)
                break;
                case 'roulette':
                    bot.commands.get('roulette').execute(message,args,master, tracker, stats_list)
                    unlock.tracker1(message.author.id, 51, 1, message, master, tracker)
                break;
                case 'help':
                    bot.commands.get('help').execute(message, args);
                break;
                case 'set':
                    bot.commands.get('set').execute(message,args, master);
                break;
                case 'boo':
                    bot.commands.get('boo').execute(message,args,master[message.author.id].gbp, master, tracker, command_stats);
                break;
                case 'steal':
                    bot.commands.get('steal').execute(message,args, master, tracker);
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
                    bot.commands.get('stats').execute(message,args, master, stats_list);
                break;
                case 'button':
                    bot.commands.get('button').execute(message,args, master, stats_list, tracker, command_stats);
                    unlock.tracker1(message.author.id, 51, 1, message, master, tracker)
                break;
                case 'info':
                    bot.commands.get('info').execute(message, args)
                break;
                case 'msg': 
                    bot.commands.get('msg').execute(message, args, master, bot)
                break;
                case 'election':
                    bot.commands.get('election').execute(message, args, master)
                break;
                case '=':
                    bot.commands.get('=').execute(message, args, master)
                break;
                case 'kumikosays':
                    bot.commands.get('kumikosays').execute(message, args)
                break;
                case 'rpg':
                    bot.commands.get('rpg').execute(message, args, master, stats_list, tracker, players)
                break
                case 'upload':
                    bot.commands.get('upload').execute(message, args)
                break;
                case 'changename':
                    bot.commands.get('changename').execute(message, args, master, stats_list, tracker)
                break;
                case 'teams':
                    bot.commands.get('teams').execute(message, args)
                break;
                case 'fish':
                   bot.commands.get('fish').execute(message, args, master, stats_list, tracker, profiles)
                break;
                case 'remind':
                    bot.commands.get('remind').execute(message, args, reminder_list, bot, master)
                break;
                case 'poll':
                    bot.commands.get('poll').execute(message, args)
                break;
                case 'test':
                    bot.commands.get('test').execute(message, master, stats_list, tracker);
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

function Welfare(channel, master){
    const fs = require('fs')
    try{
        for(i in master){
            if(isNaN(master[i].gbp) == true){
                master[i].gbp = 0;
            }
            if(master[i].gbp + master[i].account < 0){
                master[i].gbp = master[i].gbp + 250
            }else if(master[i].gbp + master[i].account < 250){
                master[i].gbp = 250 - parseFloat(master[i].account)
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

function Roulette_bets(message, money, master, stats_list){
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
                    purchase(args[0], message.author.id, master, message)
                    var bet = [args[0], args[1], message.author.id]
                    approved_bets.push(bet)
                    message.channel.send(`${master[message.author.id].name} Bet accepted`)
                    stats_list[message.author.id].roulette_bets += 1
                    if(Math.round(money) == args[0] && money >= 1000 && args[1].toLowerCase() == 'black'){
                        unlock.unlock(message.author.id, 38, message, master)
                    }
                }else{
                    message.channel.send(`${master[message.author.id].name} doesn't have enough gbp for that bet`)
                }
            }
        }else if(args[0].toLowerCase() == 'all' && master[message.author.id].gbp >= min_bet){
            if(possible_bets.includes(args[1].toLowerCase()) == true){
                purchase(args[0], message.author.id, master, message)
                var bet = [args[0], args[1], message.author.id]
                approved_bets.push(bet)
                message.channel.send(`${master[message.author.id].name} Bet accepted`)
                stats_list[message.author.id].roulette_bets += 1
                if(args[1].toLowerCase() == 'black'){
                    unlock.unlock(message.author.id, 38, message, master)
                }
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error Occured in Roulette_bets.js')
    }
}

function purchase(bet_value, player, master, message) {
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

async function JSON_Overwrite(master, stats_list, tracker, command_stats, players, channel){
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
        fs.writeFileSync ("./JSON/command_stats.json", JSON.stringify(command_stats, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
        fs.writeFileSync ("./JSON/RPG/player.json", JSON.stringify(players, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        channel.send('Error Occured in JSON_Overwrite')
    }
}

function gbp_farm_reset(channel, master){
    var deletes = JSON.parse(fs.readFileSync("./JSON/delete_tracker.json", "utf-8"))
    try{
        for(var j in master){
            master[j].steal.insurance -= 1
            if(master[j].steal.insurance < 0){
                master[j].steal.insurance = 0
            }
            if(master[j].steal.caught == true){
                master[j].steal.caught = false
                master[j].steal.attempts = 0
            }
        }
 
        for(var i in deletes){
            deletes[i].deletes = 0
        }
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

async function Daily_Functions(channel, master, unlock){
    await Welfare(channel, master)
    await Lottery(channel, master, unlock)
    await gbp_farm_reset(channel, master)
}

async function Reminder_Checker(bot, reminder_list){
    const fs = require('fs')
    var offset = new Date().getTimezoneOffset()/60
    var current_date = new Date().toUTCString().split(" ")
    var c_month = current_date[2].toLowerCase()
    var c_day = current_date[1]
    var c_year = current_date[3]
    var c_hour = parseFloat(current_date[4].split(":")[0]) - offset

    if(c_hour < 0){
        c_hour = c_hour + 24
    }

    var change = false
    //console.log("Reminder Check")
    //date_stuff = [Month Day Year Hour]

    for(var i in reminder_list){

        var date_stuff = reminder_list[i][3]
        var r_month = date_stuff[0]
        var r_day = date_stuff[1]
        var r_year = date_stuff[2]
        var r_hour = date_stuff[3]

        if(date_stuff !== []){
            if(r_month == c_month && r_day == c_day && r_year == c_year && parseInt(r_hour) == parseInt(c_hour)){
                var channel = bot.channels.find(channel => channel.id === reminder_list[i][2])
                channel.send(`<@${reminder_list[i][0]}> Reminder: \n${reminder_list[i][1]}`)
                delete reminder_list[i]
                change = true
            }
        }
    }
    if(change == true){
        fs.writeFileSync ("./JSON/reminders.json", JSON.stringify(reminder_list, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }
}