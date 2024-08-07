const Discord = require('discord.js');
const {GatewayIntentBits, Partials, Client } = require('discord.js');
const bot = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers
],
partials: [
    Partials.Channel,
    Partials.Message
  ] })
const token = process.env.NODE_ENV === 'local' ? process.env.DEVBOTTOKEN : process.env.PRODBOTTOKEN;
const PREFIX = "!";

const fs = require('fs');
const cron = require('cron')
var master = {}
var stats_list = {}
var command_stats = {}
var tracker = {}
var emojisList = {}
var buttonJSON = {}
var blackJackHands = {}
var betsOpen = {value: false}
var approvedBets = {value: []}



var teamsData = []//variable for holding teams for the teams command

bot.commands = new Discord.Collection();

const stats = require('./commands/Functions/stats_functions');
const unlock = require('./commands/Functions/Achievement_Functions');
const general = require('./commands/Functions/GeneralFunctions')

//Pulling data from faunadb or local jsons depending on current environment
const fauna_token = process.env.FAUNA_KEY

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}


bot.on('ready', () => {
    var channel = bot.channels.cache.find(channel => channel.id === '611276436145438769') || bot.channels.cache.find(channel => channel.id === '590585423202484227')
    var bot_tinkering = bot.channels.cache.find(channel => channel.id === '611276436145438769') || bot.channels.cache.find(channel => channel.id === '711634711281401867')

    master = GetJSONValue(fauna_token, token === process.env.DEVBOTTOKEN, "master")
    stats_list = GetJSONValue(fauna_token, token === process.env.DEVBOTTOKEN, "stats")
    command_stats = GetJSONValue(fauna_token, token === process.env.DEVBOTTOKEN, "command_stats")
    tracker = GetJSONValue(fauna_token, token === process.env.DEVBOTTOKEN, "tracker")
    emojisList = GetJSONValue(fauna_token, token === process.env.DEVBOTTOKEN, "emojis")

    console.log('This bot is online')
    UpdateEmojiList(emojisList)
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
})

//event that triggers when a user leaves the server
bot.on('guildMemberRemove', member =>{
    try{
        //sends message when a server member leaves the server
        var channel = bot.channels.cache.find(channel => channel.id === '611276436145438769') || bot.channels.cache.find(channel => channel.id === '590585423202484227')
        channel.send(`${master[member.id].name} has left the server`)
    }catch(err){
        console.log('Error occured in user remover log')
        console.log(err)
    }
})

//event that triggers every time a message is sent
bot.on('messageCreate', message =>{
    try{
        if(!message.author.bot){ //filters out bot messages from tracking
            //commmands that ary run every time someone sends a message
            bot.commands.get('more_money').execute(message, master, stats_list, tracker);
            bot.commands.get('insults_counter').execute(message, master, stats_list);
            bot.commands.get('boo_trigger').execute(message, command_stats);
            if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){
                stats.tracker(message.author.id, 7, 1, stats_list)
            }

            ['712755269863473252', '611276436145438769'].includes(message.channel.id) == true //not sure what this is for. can probably delete this line
            if(betsOpen.value && ['712755269863473252', '611276436145438769'].includes(message.channel.id) == true){ //checks if a roulette round has started and that the user is in the appropriate channel to play
                Roulette_bets(message, master[message.author.id].gbp, master, stats_list, approvedBets)
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in message parser")
    }
})

bot.on('messageCreate', message =>{    
    try{
        let args = message.content.substring(PREFIX.length).split(" ");
        if (message.content.startsWith("!") == true){ //only runs a command if it starts with an "!"
            if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){ //668996755211288595 is the prod bot, 712114529458192495 is dev bot. only commands run by actual users are stat tracked
                stats.tracker(message.author.id, 8, 1, stats_list) //total commands stat tracker
            }
            switch(args[0].toLowerCase()){
                case 'ping': //lets you ping the bot to see if its running
                    bot.commands.get('ping').execute(message, buttonJSON);
                break;
                case 'pug': //sends pic of a pug
                    bot.commands.get('pug').execute(message,master, tracker); 
                break;
                case '21': //blackjack
                    bot.commands.get('21').execute(message, args, master, blackJackHands, tracker, stats_list);
                    //Gambling Addict Achievement
                    unlock.tracker1(message.author.id, 46, 1, message, master, tracker)
                break;
                case 'flip': //flips a coin
                    bot.commands.get('flip').execute(message, master, tracker);
                break;
                case 'council': //lets you ask the council a question
                    bot.commands.get('council').execute(message,master,tracker);
                break;
                case 'bank': //users can check their gbp and the gbp of others
                    bot.commands.get('bank').execute(message,args, master);
                break;
                case 'insults': //lets a user check who is being insulted, lets them add and remove people from being insulted
                    bot.commands.get('insults').execute(message,args, master, tracker);
                break;
                case 'delete': //lets a user delete messages
                    bot.commands.get('delete').execute(message,args,master[message.author.id].gbp, master, tracker);
                break;
                case 'gg': //game where the user gets three tries to guess a number between 1 and 100
                    bot.commands.get('gg').execute(message,args,master[message.author.id].gbp, master, stats_list, tracker);
                    //Gambling Addict Achievement
                    unlock.tracker1(message.author.id, 46, 1, message, master, tracker)
                break;
                case 'transfer': //lets users transfer gbp between eachother
                    bot.commands.get('transfer').execute(message,args, master);
                break;
                case 'kumiko': //sends the user a picture of kumiko from the Sound Euphonium
                    bot.commands.get('kumiko').execute(message, master, tracker);
                break;
                case 'powerball': //lets users buy lottery tickets and check stats on it
                    bot.commands.get('powerball').execute(message,args, master[message.author.id].gbp, master, stats_list, tracker, command_stats)
                    //Gambling Addict Achievement
                    unlock.tracker1(message.author.id, 46, 1, message, master, tracker)
                break;
                case 'names': //lists the names of all users on server
                    bot.commands.get('names').execute(message,master)
                break;
                case 'roles': //lists the current role holders on the server
                    bot.commands.get('roles').execute(message, master)
                break;
                case 'changelog': //lists the most recent changes to the bot
                    bot.commands.get('changelog').execute(message)
                break;
                case 'roulette': //lets users play roulette
                    bot.commands.get('roulette').execute(message,args,master, tracker, stats_list, betsOpen, approvedBets)
                    //Gambling Addict Achievement
                    unlock.tracker1(message.author.id, 46, 1, message, master, tracker)
                break;
                case 'help': //gives a list of all commands
                    bot.commands.get('help').execute(message, args);
                break;
                case 'set': //lets me set others gbp values
                    bot.commands.get('set').execute(message,args, master);
                break;
                case 'boo': //lets users set who is currently being booed by the bot
                    bot.commands.get('boo').execute(message,args, master, tracker, command_stats);
                break;
                case 'steal': //lets users steal gbp from eachother
                    bot.commands.get('steal').execute(message,args, master, tracker, bot);
                break;
                case 'achievements': //lists all the achievements on the server
                    bot.commands.get('achievements').execute(message,args, master, tracker);
                break;
                case 'stats': //lets users check stats associated with their server activity 
                    bot.commands.get('stats').execute(message,args, master, stats_list);
                break;
                case 'button': //lets users push a button for a chance of winning 100 gbp or losing 1000 gbp
                    bot.commands.get('button').execute(message,args, master, buttonJSON, command_stats);
                    //Gambling Addict Achievement
                    unlock.tracker1(message.author.id, 46, 1, message, master, tracker)
                break;
                case 'msg': //lets users make the bot dm a different user
                    bot.commands.get('msg').execute(message, args, master, bot)
                break;
                case '=': //basic calculator
                    bot.commands.get('=').execute(message, args)
                break;
                case 'kumikosays': //creates image of kumiko with a speak bubble with user inputted text
                    bot.commands.get('kumikosays').execute(message, args, bot)
                break;
                case 'changename': //lets me change someones name in the bot functions
                    bot.commands.get('changename').execute(message, args, master, stats_list, tracker)
                break;
                case 'teams': //lets users randomly generate teams
                    bot.commands.get('teams').execute(message, args, teamsData)
                break;
                case 'emojis':
                    bot.commands.get('emojis').execute(message, args, emojisList, bot)
                break;
                case 'update': //command that is only used for dev work and changed for testing purposes
                    bot.commands.get('update').execute(message, fauna_token, process.env.NODE_ENV, stats_list, tracker, command_stats, emojisList)
                break;
                case 'test': //another command for testing purposes only
                    //bot.commands.get('test').execute(message, args, master, blackJackHands, tracker, stats_list);
                    console.log("Dont worry about it")
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

bot.on('messageReactionAdd', reaction => {
    try{
        UpdateEmojiListCount(reaction._emoji.id, 1, reaction, true)
    }catch(err){
        console.log(err)
    }
})

bot.on('messageReactionRemove', reaction => {
    try{
        UpdateEmojiListCount(reaction._emoji.id, -1, reaction, false)
    }catch(err){
        console.log(err)
    }
})

bot.on('emojiCreate', emojiCreate => {
    try{
        console.log(emojiCreate)
        UpdateEmojiList(emojisList)
    }catch(err){
        console.log(err)
    }
})

bot.on('emojiDelete', emojiDelete => {
    try{
        console.log(emojiDelete)
        RemoveEmojiFromList(emojisList)
    }catch(err){
        console.log(err)
    }
})

bot.on('interactionCreate', interaction => {
    try{
        ButtonInteractions(interaction, buttonJSON, command_stats, stats_list, master, tracker)
    }catch(err){
        console.log(err)
        interaction.message.channel.send('Error occurred with button interaction')
    }
})


//adds 250 gbp or sets them to 250 gbp if they are above 0 gbp
function Welfare(channel, master){
    try{
        for(var i in master){
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
    }catch(err){
        console.log(err)
        channel.send('Error Occured in Welfare')
    }
}

//function used to track users bets when a round a roulette has started
function Roulette_bets(message, money, master, stats_list, approvedBets){
    var args = message.content.split(" ")
    var possible_bets = fs.readFileSync('./text_files/roulette/roulette_bets','utf-8').split(",") //a list of all bets that a user can make
    var min_bet = 10;
    var bet = false

    try{
        if(isNaN(args[0]) == false && args[0] >= min_bet){
            if(possible_bets.includes(args[1].toLowerCase()) == true){
                if(money >= args[0]){
                    general.CommandPurchase(message, master, args[0], general.defaultRecipient)
                    bet = [args[0], args[1], message.author.id]
                    approvedBets.value.push(bet)
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
                general.CommandPurchase(message, master, args[0], general.defaultRecipient)
                bet = [args[0], args[1], message.author.id]
                approvedBets.value.push(bet)
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

function Lottery(channel, master, unlock){
    var odds = 250
    var number = Math.ceil(Math.random()*odds);
    var pot = 1000
    var success = false
    channel.send("The Daily Lottery Drawing is occuring...")
    for(var i in master){
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
    Fauna_update(fauna_token, "emojis", emojisList, process.env.NODE_ENV)
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

function GetJSONValue(faunaToken, isDev, location){
    if(!isDev){
        return Fauna_get(faunaToken, location, process.env.NODE_ENV)
    }

    const fs = require('fs')
    return JSON.parse(fs.readFileSync(`./JSON/${location}.json`, "utf-8"))
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
        prefix = 'prod'
    }
    const jsons = JSON.parse(fs.readFileSync(`./JSON/${prefix}_faunadb.json`, 'utf-8'))

    //then checks the corresponding json file for the reference ids and grabs the correct data from faunadb
    await fauna_client.query(
        q.Get(q.Ref(q.Collection(`${prefix}_JSONs`), jsons[name]))
    ).then((response) => {
        switch(name){
            case "master":
                master = response.data
            return master
            case "stats":
                stats_list = response.data
            return stats_list
            case "tracker":
                tracker = response.data
            return tracker
            case "command_stats":
                command_stats = response.data
            return command_stats
            case "emojis":
                emojisList = response.data
            return emojisList
    }}).catch(err => console.log(err))
}


//Just used to move the JSON files over to faunadb
// async function Fauna_create(fauna_token, name){
//     const fs = require('fs')
//     const faunadb = require('faunadb')
//     const fauna_client = new faunadb.Client({ secret: fauna_token })
//     const q = faunadb.query
//     const fauna_json = JSON.parse(fs.readFileSync("./JSON/prod_faunadb.json", "utf-8"))

//     fauna_client.query(
//         q.Create(q.Collection("prod_JSONs"), {
//             data: 
//             JSON.parse(fs.readFileSync(`./JSON/${name}.json`,'utf-8'))
//         }
//         )
//     )

// }

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
        prefix = 'prod'
    }
    const jsons = JSON.parse(fs.readFileSync(`./JSON/${prefix}_faunadb.json`, 'utf-8'))

    //then takes the reference number from the corresponding json file and update that reference document in faunadb
    await fauna_client.query(
        q.Update(q.Ref(q.Collection(`${prefix}_JSONs`), jsons[name]), {
            data: file
        }

        )
    )

}

function UpdateEmojiList(emojisList){
    const fs = require('fs')
    bot.emojis.cache.forEach(emoji => {
        if(!(emoji.id in emojisList)){
            emojisList[emoji.id] = {name: emoji.name, count: 0}
        }
    })

    fs.writeFileSync("./JSON/emojis.json", JSON.stringify(emojisList, null, 2))
    return
}

function RemoveEmojiFromList(emojisList){
    const fs = require('fs')

    for(var emoji in emojisList){
        
        var foundEmoji = bot.emojis.cache.find(e => e.id === emoji)
        if(!foundEmoji){
            delete emojisList[emoji]
        }
    }

    fs.writeFileSync("./JSON/emojis.json", JSON.stringify(emojisList, null, 2))
    return
}

function UpdateEmojiListCount(emojiID, increment, reaction){
    if(emojisList[emojiID] == undefined){
        return
    }

    //if there is no cache it means the last reaction was removed. That means there was no bot reaction and it can be counted as a removal
    if(reaction.users.cache.size == 0){
        emojisList[emojiID].count += increment;
        return
    }

    //if the first and only reaction is a bot then it is ignored from counting
    if((reaction.users.cache.first().bot && increment == 1 && reaction.users.cache.size == 1)){
        return
    }

    //if the emojis is not in the emoji list (such as a non-custom emoji) it is ignored 
    //NEED TO DOUBLE CHECK THIS WITH CUSTOM EMOJIS NOT NATIVE TO THE SERVER
    if(!(emojiID in emojisList)){
        return
    }
    emojisList[emojiID].count += increment;
    return
}

function ButtonInteractions(interaction, buttonJSON, command_stats, stats_list, master, tracker){
    const embed = require('./commands/Functions/embed_functions')
    const unlock = require('./commands/Functions/Achievement_Functions')

    if(!["button", "bigButton"].includes(interaction.customId)){
        return
    }

    var userID = String(interaction.user.id)

    if(buttonJSON[userID] == null){
        return
    }

    if(buttonJSON[userID].currentMessageID != interaction.message.id){
        return
    }

    var buttonPayout = Math.floor(Math.random() * 10)

    if(interaction.customId == "button"){
        if(buttonPayout == 5){
            buttonPayout = -1000
            command_stats.button.Total_Losses = command_stats.button.Total_Losses + 1
            command_stats.button.Last_loss = 0
            stats_list[interaction.user.id].button_losses += 1
        }else{
            buttonPayout = 100
            command_stats.button.Last_loss = command_stats.button.Last_loss + 1
        }
    }else{
        if(buttonPayout == 7){
            buttonPayout = -10000
            command_stats.button.Total_Losses = command_stats.button.Total_Losses + 1
            command_stats.button.Last_loss = 0
            stats_list[interaction.user.id].button_losses += 1
        }else{
            buttonPayout = 1000
            command_stats.button.Last_loss = command_stats.button.Last_loss + 1
        }
    }

    stats_list[userID].button_presses = stats_list[userID].button_presses + 1
    command_stats.button.Total_Presses = command_stats.button.Total_Presses + 1
    
    //Wyatt Achievement
    unlock.tracker1(interaction.user.id, 44, 1, interaction.message, master, tracker)

    buttonJSON[userID].currentSessionAmount += buttonPayout
    buttonJSON[userID].currentSessionPresses += 1
    master[userID].gbp += buttonPayout   //this and other interactions should be the only place "Command Purchase" isn't used because the message sender is the bot not the user

    var title = `${master[interaction.user.id].name} current Button Session`
    var description = [`Last Button Payout: ${buttonPayout}`, `Total GBP earned: ${buttonJSON[userID].currentSessionAmount}`, `Total button presses: ${buttonJSON[userID].currentSessionPresses}`]

    //add embed message that updates with last payout and cum payout on message
    const embedMessage = embed.EmbedCreator(interaction.message, title, description, embed.emptyValue)

    interaction.update({
        //content: 'Button'
        embeds: [embedMessage]
    })
}