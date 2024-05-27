const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const bot = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const token = process.env.NODE_ENV === 'local' ? process.env.DEVBOTTOKEN : process.env.PRODBOTTOKEN;
const PREFIX = "!";

const fs = require('fs');
const cron = require('cron')

bot.commands = new Discord.Collection();

const stats = require('./commands/Functions/stats_functions');
const unlock = require('./commands/Functions/Achievement_Functions');

//Pulling data from faunadb or local jsons depending on current environment
const fauna_token = process.env.FAUNA_KEY
GetJSONValues(fauna_token, token === process.env.DEVBOTTOKEN);


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}


bot.on('ready', () => {
    var channel = bot.channels.cache.find(channel => channel.id === '611276436145438769') || bot.channels.cache.find(channel => channel.id === '590585423202484227')
    var bot_tinkering = bot.channels.cache.find(channel => channel.id === '611276436145438769') || bot.channels.cache.find(channel => channel.id === '711634711281401867')

    console.log('This bot is online')
    stocks_open = false
    if(typeof(cron_job) == 'undefined'){
        cron_job = 'something'
        bot_tinkering.send('The bot is online')    
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
                JSON_Overwrite(master, stats_list, tracker, command_stats, fauna_token)
            },2000)
        }, null, true)
    }
})

bot.on('guildMemberRemove', member =>{
    try{
        var channel = bot.channels.cache.find(channel => channel.id === '611276436145438769') || bot.channels.cache.find(channel => channel.id === '590585423202484227')
        channel.send(`${master[member.id].name} has left the server`)
    }catch(err){
        console.log('Error occured in user remover log')
    }
})

bot.on('message', message =>{
    try{
        if(message.author.bot == false){
            bot.commands.get('more_money').execute(message, master, stats_list, tracker);
            bot.commands.get('insults_counter').execute(message, master, tracker, stats_list);
            bot.commands.get('boo_trigger').execute(message, command_stats);
            if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){
                stats.tracker(message.author.id, 7, 1, stats_list)
            }

            ['712755269863473252', '611276436145438769'].includes(message.channel.id) == true
            if(typeof(bets_open) !== 'undefined' && ['712755269863473252', '611276436145438769'].includes(message.channel.id) == true){
                Roulette_bets(message, master[message.author.id].gbp, master, stats_list)
            }
        }
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
                    bot.commands.get('ping').execute(message, fauna_token, master, bot);
                break;
                case 'pug':
                    bot.commands.get('pug').execute(message,master, tracker); 
                break;
                case '21':
                    bot.commands.get('21').execute(message,args,master[message.author.id].gbp, master, stats_list, tracker);
                    //Gambling Addict Achievement
                    unlock.tracker1(message.author.id, 46, 1, message, master, tracker)
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
                    //Gambling Addict Achievement
                    unlock.tracker1(message.author.id, 46, 1, message, master, tracker)
                break;
                case 'transfer':
                    bot.commands.get('transfer').execute(message,args,master[message.author.id].gbp, master);
                break;
                case 'kumiko':
                    bot.commands.get('kumiko').execute(message,master[message.author.id].gbp, master, tracker);
                break;
                case 'powerball':
                    bot.commands.get('powerball').execute(message,args, master[message.author.id].gbp, master, stats_list, tracker, command_stats)
                    //Gambling Addict Achievement
                    unlock.tracker1(message.author.id, 46, 1, message, master, tracker)
                break;
                case 'names':
                    bot.commands.get('names').execute(message,master)
                break;
                case 'master':
                    bot.commands.get('master').execute(message,args, master, stats_list, tracker, command_stats)
                break;
                case 'roles':
                    bot.commands.get('roles').execute(message, master)
                break;
                case 'changelog':
                    bot.commands.get('changelog').execute(message)
                break;
                case 'roulette':
                    bot.commands.get('roulette').execute(message,args,master, tracker, stats_list)
                    //Gambling Addict Achievement
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
                    bot.commands.get('steal').execute(message,args, master, tracker, bot);
                break;
                case 'achievements':
                    bot.commands.get('achievements').execute(message,args, master, tracker);
                break;
                case 'stats':
                    bot.commands.get('stats').execute(message,args, master, stats_list);
                break;
                case 'button':
                    bot.commands.get('button').execute(message,args, master, stats_list, tracker, command_stats);
                    //Gambling Addict Achievement
                    unlock.tracker1(message.author.id, 51, 1, message, master, tracker)
                break;
                case 'msg': 
                    bot.commands.get('msg').execute(message, args, master, bot)
                break;
                case '=':
                    bot.commands.get('=').execute(message, args, master)
                break;
                case 'kumikosays':
                    bot.commands.get('kumikosays').execute(message, args)
                break;
                case 'changename':
                    bot.commands.get('changename').execute(message, args, master, stats_list, tracker)
                break;
                case 'teams':
                    bot.commands.get('teams').execute(message, args)
                break;
                case 'roles':
                   bot.commands.get('roles').execute(message, args, master)
                break;
                case 'update':
                    //bot.commands.get('update').execute(message, fauna_token, process.env.NODE_ENV)
                    //JSON_Overwrite(master, stats_list, tracker, command_stats, fauna_token);
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

bot.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});

bot.on('error', (err) => {
    console.error(err.message)
});

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
                    RoulettePurchase(args[0], message.author.id, master, message)
                    var bet = [args[0], args[1], message.author.id]
                    approved_bets.push(bet)
                    message.channel.send(`${master[message.author.id].name} Bet accepted`)
                    stats_list[message.author.id].roulette_bets += 1
                    if(Math.round(money) == args[0] && money >= 1000 && args[1].toLowerCase() == 'black'){
                        //Bet it All on Black Achievement
                        unlock.unlock(message.author.id, 38, message, master)
                    }
                }else{
                    message.channel.send(`${master[message.author.id].name} doesn't have enough gbp for that bet`)
                }
            }
        }else if(args[0].toLowerCase() == 'all' && master[message.author.id].gbp >= min_bet){
            if(possible_bets.includes(args[1].toLowerCase()) == true){
                RoulettePurchase(args[0], message.author.id, master, message)
                var bet = [args[0], args[1], message.author.id]
                approved_bets.push(bet)
                message.channel.send(`${master[message.author.id].name} Bet accepted`)
                stats_list[message.author.id].roulette_bets += 1
                if(args[1].toLowerCase() == 'black'){
                    //Bet it all on Black Achievement
                    unlock.unlock(message.author.id, 38, message, master)
                }
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error Occured in Roulette_bets.js')
    }
}

function RoulettePurchase(bet_value, player, master, message) {
    try{
        master[player].gbp = parseFloat(master[player].gbp) - parseFloat(bet_value)

    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Index.js RoulettePurchase");
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
            //Jackpot Achievement
            unlock.index_unlock(i, 10, channel, master)
            success = true
        }
    }
    if(success == false){
        channel.send('No winners')
    }
}

async function JSON_Overwrite(master, stats_list, tracker, command_stats, fauna_token){
    Fauna_update(fauna_token, "master",master, process.env.NODE_ENV)
    Fauna_update(fauna_token, "stats", stats_list, process.env.NODE_ENV)
    Fauna_update(fauna_token, "tracker", tracker, process.env.NODE_ENV)
    Fauna_update(fauna_token, "command_stats", command_stats, process.env.NODE_ENV)
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

function GetJSONValues(fauna_token, isDev){
    if(isDev){
        console.log("Dev Environment");
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        stats_list = JSON.parse(fs.readFileSync("./JSON/stats.json", "utf-8"))
        tracker = JSON.parse(fs.readFileSync("./JSON/achievements_tracker.json", "utf-8"))
        command_stats = JSON.parse(fs.readFileSync("./JSON/command_stats.json", "utf-8"))
        return;
    }

    master =  Fauna_get(fauna_token, "master", process.env.NODE_ENV)
    stats_list =  Fauna_get(fauna_token, "stats", process.env.NODE_ENV)
    tracker =  Fauna_get(fauna_token, "tracker", process.env.NODE_ENV)
    command_stats =  Fauna_get(fauna_token, "command_stats", process.env.NODE_ENV)
}

async function Fauna_get(fauna_token, name, location){
    const faunadb = require('faunadb')
    const fauna_client = new faunadb.Client({ secret: fauna_token })
    const q = faunadb.query
    const fs = require('fs')

    //first checks if it should grab the dev or the prod bot's data
   if(location == 'local'){
        var prefix = 'dev'
    }else{
        var prefix = 'prod'
    }
    const jsons = JSON.parse(fs.readFileSync(`./JSON/${prefix}_faunadb.json`, 'utf-8'))

    //then checks the corresponding json file for the reference ids and grabs the correct data from faunadb
    var getP = await fauna_client.query(
        q.Get(q.Ref(q.Collection(`${prefix}_JSONs`), jsons[name]))
    ).then((response) => {
        switch(name){
            case "master":
                master = response.data
                return master
            break;
            case "stats":
                stats_list = response.data
                return stats_list
            break;
            case "tracker":
                tracker = response.data
                return tracker
            break;
            case "command_stats":
                command_stats = response.data
                return command_stats
            break;

    }}).catch(err => console.log(err))
}


//Just used to move the JSON files over to faunadb
async function Fauna_create(fauna_token, name){
    const fs = require('fs')
    const faunadb = require('faunadb')
    const fauna_client = new faunadb.Client({ secret: fauna_token })
    const q = faunadb.query
    const fauna_json = JSON.parse(fs.readFileSync("./JSON/prod_faunadb.json", "utf-8"))

    fauna_client.query(
        q.Create(q.Collection("prod_JSONs"), {
            data: 
            JSON.parse(fs.readFileSync(`./JSON/${name}.json`,'utf-8'))
        }
        )
    )

}

//used to update the faunadb database
async function Fauna_update(fauna_token, name, file, location){
    const faunadb = require('faunadb')
    const fauna_client = new faunadb.Client({ secret: fauna_token })
    const q = faunadb.query
    const fs = require('fs')

    //first checks if it should grab the dev or the prod bot's data
    if(location == 'local'){
        var prefix = 'dev'
    }else{
        var prefix = 'prod'
    }
    const jsons = JSON.parse(fs.readFileSync(`./JSON/${prefix}_faunadb.json`, 'utf-8'))

    //then takes the reference number from the corresponding json file and update that reference document in faunadb
    var updateP = await fauna_client.query(
        q.Update(q.Ref(q.Collection(`${prefix}_JSONs`), jsons[name]), {
            data: file
        }

        )
    )

}