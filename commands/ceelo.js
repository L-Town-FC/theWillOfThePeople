module.exports = {
    name: 'ceelo',
    description: 'lets you play ceelo with others',
    execute(message, args, master, stats_list, tracker){
        
        const fs = require('fs')
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        var command = args[1] || 'default'
        var ceelo = JSON.parse(fs.readFileSync('./JSON/ceelo.json', 'utf-8'))
        var name = args[2]

        switch(command){
            case 'start':
                //!ceelo start [bet] Initiates game with specified bet
                //creates timer for others to join and then closes so people can't join midgame
                try{
                    Ceelo_Start(message, args, ceelo, master)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occured in ceelo.js Start')
                }
            break;
            case 'join':
                //lets people join the game before it closes
                try{
                    Ceelo_Join(message, ceelo, master)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occured in ceelo.js Join')
                }
            break;
            break;
            case 'roll':
                //lets you roll the dice
                try{
                    Ceelo_Roll(message, ceelo, master)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in ceelo.js Roll')
                }
            break;
            case 'wash':
                //lets you roll the dice but they don't count
                try{
                    Ceelo_Wash(message, ceelo, master)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in ceelo.js Wash')
                }
            break;
            case 'basics':
                //Shows the the hand rankings
                try{
                    Ceelo_Basics(message)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in ceelo.js Basics')
                }
            break;
            case 'status':
                //Make it so game is seachable for the score like how help works
                try{
                    if(typeof(name) == 'undefined'){
                        Ceelo_Status_All(message, ceelo, master)
                    }else{
                        Ceelo_Status_Check(message, args, ceelo, master)
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in ceelo.js Status')
                }
            break;
            case 'help':
                //List of commands
                try{
                    Ceelo_Help(message)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in ceelo.js Help')
                }
            break;
            case 'reset':
                //lets me reset the game if necessary
                try{
                    Ceelo_Reset(message, args)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error Occurred in ceelo.js Reset')
                }
            break
            default:
                message.channel.send('Use "!ceelo help" for a list of commnands')
        }
    }
}

function Ceelo_Start(message, args, ceelo, master){
    const fs = require('fs')
    const min_bet = 15
    var time = 15
    var games = Object.keys(ceelo.games).length
    var bet = args[2]
    for(var j in ceelo.games){
        //checks if there are any games that have been created but not started and would therefore be joinable
        if(ceelo.games[j].game_start == false){
            var ongoing = true
        }
    }
    if(isNaN(bet) == true || parseFloat(bet) < min_bet){
        message.channel.send(`Please give a valid bet of ${min_bet} gbp or greater`)
    }else if(master[message.author.id].gbp < parseFloat(bet)){
        message.channel.send(`You don't have enough gbp for that bet`)
    }else{
        if(typeof(ongoing) == 'undefined'){
            //if no joinable games exist it means that this variable is undefined
            //A joinable game is then created
            message.channel.send(`You have ${time} seconds to join the game`)
            if(games == 0){
                var i = 1
                //participants goes [id, turn number, hand value, roll number, actual hand]
                ceelo.games[i] = {
                    "participants" : [[message.author.id ,0 ,0 ,0, 0]],
                    "bet": parseFloat(bet),
                    "game_start": false,
                    "message_counter": 10,
                }
            }else{
                for(var i in ceelo.games){
                    if(ceelo.games[i].participants.includes(message.author.id)){
                        var inGame = true
                        //uncomment this out so you can only join 1 game at a time
                    }
                }
                if(typeof(inGame) === 'undefined'){
                    i = parseInt(i) + 1
                    ceelo.games[i] = {
                        "participants" : [[message.author.id ,0 ,0 ,0, 0]],
                        "bet": parseFloat(bet),
                        "game_start": false,
                        "message_counter": 10
                    }
                }
            }
            if(typeof(i) !== 'undefined'){
                setTimeout(function(){
                    var ceelo2 = JSON.parse(fs.readFileSync('./JSON/ceelo.json', 'utf-8'))
                    if(ceelo2.games[i].participants.length > 1){
                        ceelo2.games[i].game_start = true
                        message.channel.send(`Game started \nIt is ${master[ceelo2.games[i].participants[0][0]].name}'s turn`)
                    }else{
                        message.channel.send('Not enough players. Game cancelled')
                        delete ceelo2.games[i]
                    }
                    fs.writeFileSync ("./JSON/ceelo.json", JSON.stringify(ceelo2, null, 2), function(err) {
                        if (err) throw err;
                        console.log('complete');
                        }
                    );
                },time * 1000)
            }
        }else{
            //A joinable game does exist so there is no need to create a new one
            message.channel.send('There is already a joinable game')
        }
        fs.writeFileSync ("./JSON/ceelo.json", JSON.stringify(ceelo, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }
}

function Ceelo_Join(message, ceelo, master){
    const fs = require('fs')
    var ceelo = JSON.parse(fs.readFileSync('./JSON/ceelo.json', 'utf-8'))
    for(var i in ceelo.games){
        if(typeof(ceelo.games[i]) !== 'undefined'){    
            for(var j in ceelo.games[i].participants){
                if(ceelo.games[i].participants[j][0] == message.author.id){
                    var inGame = true
                    //uncomment this out later so same person can't be in multiple games
                }
            }
            if(ceelo.games[i].game_start == false){
                var joinable = true
                var join_index = i
            }
        }
    }
    if(typeof(joinable) !== 'undefined'){
        if(typeof(inGame) == 'undefined'){
            //If you aren't in a game currently and there a joinable game exists you are here
            if(master[message.author.id].gbp >= ceelo.games[join_index].bet){
                ceelo.games[join_index].participants.push([message.author.id ,0 , 0, 0, 0])
                message.channel.send(`${master[message.author.id].name} joined the game`)
                fs.writeFileSync ("./JSON/ceelo.json", JSON.stringify(ceelo, null, 2), function(err) {
                    if (err) throw err;
                    console.log('complete');
                    }
                );
            }else{
                message.channel.send(`You must have at least ${ceelo.games[join_index].bet} gbp to join`)
            }
        }else{
            message.channel.send('You are already in a game')
        }   
    }else{
        message.channel.send('No joinable game')
    }
    
}

function Ceelo_Roll(message, ceelo, master){
    //Starts by saying whos turn it is to roll
    //once they roll, change the second number in the pair to 1
    //after everyone has rolled, compare scores and assign winner
    //in event of tie, reset
    //once winner has been decided, clear ceelo_players and game_start
    const fs = require('fs')
    var player = message.author.id
    for(var i in ceelo.games){
        for(var j = 0; j < ceelo.games[i].participants.length; j++){
            if(player == ceelo.games[i].participants[j][0]){
                var player_game = i
                var participant_number = j
            }
        }
        if(typeof(player_game) == 'undefined'){
            message.channel.send(`You currently aren't in a game`)
        }else if(ceelo.games[i].game_start == false){
            message.channel.send(`The game hasn't started yet`)
        }else if(typeof(ceelo.games[player_game].participants[participant_number-1]) == 'undefined' || ceelo.games[player_game].participants[participant_number-1][1] == 1){
            if(ceelo.games[player_game].participants[participant_number][1] == 0){
                //Its your turn. Roll the dice
                //participants goes [id, turn number, hand value, roll number, actual hand]
                var roll = Roll()
                ceelo.games[player_game].message_counter = 10
                message.channel.send(`${master[message.author.id].name} Hand: \n${roll[0]}`)
                if(roll[1] >= 0 && ceelo.games[player_game].participants[participant_number][3] < 80){
                    message.channel.send('Good Roll')
                    ceelo.games[player_game].participants[participant_number] = [player, 1, roll[1], 0, roll[0]]//first 0 should become 1
                    if(typeof(ceelo.games[player_game].participants[participant_number + 1]) !== 'undefined'){
                        message.channel.send(`It is now <@${ceelo.games[player_game].participants[participant_number + 1][0]}>'s turn`)
                    }
                }else if(ceelo.games[player_game].participants[participant_number][3] >= 80){
                    ceelo.games[player_game].participants[participant_number] = [player, 0, roll[1], 3, roll[0]]
                    ceelo.games[player_game].participants[participant_number][1] = 1
                    if(roll[1] < 0){
                        message.channel.send('You ran out of rolls')
                    }
                }else{
                    message.channel.send('Roll Again')
                    ceelo.games[player_game].participants[participant_number] = [player, 0, roll[1], ceelo.games[player_game].participants[participant_number][3] + 1, roll[0]]
                }

                Round_Over(message, player_game, ceelo, master)
                
                //Need to introduce check for if everyone has rolled or not
                //Also set persons score to 0 and their turn to -1 if they aren't involved in tie

                fs.writeFileSync ("./JSON/ceelo.json", JSON.stringify(ceelo, null, 2), function(err) {
                    if (err) throw err;
                    console.log('complete');
                    }
                );
            }else{
                message.channel.send(`It isn't your turn`)
            }
            
        }else{
            console.log(typeof(ceelo.games[player_game].participants[participant_number-1]))
            console.log(ceelo.games[player_game].participants[participant_number-1][2])
        }
    }
    

}

function Ceelo_Wash(message, ceelo, master){
    var roll = Roll()
    message.channel.send(`${master[message.author.id].name} Hand: ${roll[0]}`)
}

function Roll(){
    //wash should be a boolean
    var hand = []
    for(var i = 0; i < 3; i++){
        hand.push(Math.ceil(Math.random() * 6))
    }

    //
    //hand = [1,2,2]
    //

    orig_hand = [hand[0], hand[1], hand[2]]
    hand = hand.sort((a,b) => b - a)
    var value
    if(hand[0] == hand[1] && hand[0] !== hand[2]){
        value = hand[2]
    }else if(hand[1] == hand[2] && hand[0] !== hand[2]){
        value = hand[0]
    }else if(hand.includes(1) == true && hand.includes(2) == true && hand.includes(3) == true){
        value = 0
    }else if(hand[0] == hand[1] && hand[0] == hand[2]){
        value = hand[0] + 6
    }else if(hand.includes(4) == true && hand.includes(5) == true && hand.includes(6) == true){
        value = 13
    }else{
        value = -1
    }

    //console.log([orig_hand, value])

    return [orig_hand, value]
}

function Round_Over(message, player_game, ceelo, master){
    //checks if the round of hands is over and if there are any ties
    var counter = 0
    var isOverCounter = 0
    var hand_values = []
    for(var i = 0;i < ceelo.games[player_game].participants.length; i++){
        counter++
        if(ceelo.games[player_game].participants[i][1] == 1){
            isOverCounter++
            hand_values.push(ceelo.games[player_game].participants[i][2])
        }
    }
    if(counter == isOverCounter){
        //games is over
        //check for tie
        var best = Math.max.apply(Math, hand_values)
        var isTie = find_duplicate_in_array(hand_values)
        //console.log(`hand_values is: ${hand_values}`)
        //console.log(`isTie is: ${isTie}`)
        //console.log(`best is: ${best}`)
        if(isTie !== [] && Math.max.apply(Math, isTie) == best){
            //There is a tie and it is with the largest value
            //Find all users with returned value and reset them. Put everyone else at turn number = 1 and a score of -2
            //if they have -2, don't reset them. It means there have been multiple rounds of ties
            var tied_players = []
            for(var i in hand_values){
                if(hand_values[i] == best){
                    tied_players.push(ceelo.games[player_game].participants[i][0])
                    ceelo.games[player_game].participants[i][1] = 0
                    ceelo.games[player_game].participants[i][2] = 0
                    ceelo.games[player_game].participants[i][3] = 0
                    ceelo.games[player_game].participants[i][4] = 0
                }else{
                    ceelo.games[player_game].participants[i][1] = 1
                    ceelo.games[player_game].participants[i][2] = -2
                    ceelo.games[player_game].participants[i][3] = 0
                    ceelo.games[player_game].participants[i][4] = 0
                }
            }
            message.channel.send(`Player pushed roll. Next round begins`)
            message.channel.send(`It is <@${tied_players[0]}>`)
        }else{
            //There is a definite winner
            console.log(best)
            for(var i = 0; i < ceelo.games[player_game].participants.length; i++){
                master[ceelo.games[player_game].participants[i][0]].gbp -= ceelo.games[player_game].bet
                if(ceelo.games[player_game].participants[i][2] == best){
                    var winner = ceelo.games[player_game].participants[i][0]
                    var amount = parseFloat(ceelo.games[player_game].participants.length * ceelo.games[player_game].bet)
                    master[winner].gbp += amount
                    message.channel.send(`${master[winner].name} won. They win ${amount - ceelo.games[player_game].bet}`)
                }
            }
            delete ceelo.games[player_game]
        }
        
    }else{
        //console.log('here')
        //game is not over
        //return something that says that
    }
    function find_duplicate_in_array(arra1) {
        var object = {};
        var result = [];
    
        arra1.forEach(item => {
        if(!object[item])
            object[item] = 0;
            object[item] += 1;
        })
    
        for (const prop in object) {
        if(object[prop] >= 2) {
            result.push(prop);
        }
        }
        return result;
    }
}

function Ceelo_Status_All(message, ceelo, master){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var Status_embed = new Discord.RichEmbed()
    .setTitle('Ceelo Game Status')
    .setColor(embed.Color(message))
    var embed_stuff = []
    var names = []
    
    for(var i in ceelo.games){
        if(typeof(ceelo.games[i]) !== 'undefined'){
            for(var j = 0; j < ceelo.games[i].participants.length; j++){
                names.push(master[ceelo.games[i].participants[j][0]].name)
            }
            embed_stuff.push([`${i}: ${names}`])
            names = []
        }
    }
    if(embed_stuff.length == 0){
        embed_stuff = 'None'
    }
    //console.log(embed_stuff)
    Status_embed.addField('**Games:**',embed_stuff)
    message.channel.send(Status_embed)
}

function Ceelo_Status_Check(message, args, ceelo, master){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var index = ""
    for(var i in ceelo.games){
        if(args[2] == i){
            index = i
        }
    }
    if(index == ""){
        message.channel.send('Please choose a valid game')
    }else{
        var Status_embed = new Discord.RichEmbed()
        .setTitle('Ceelo Game Status')
        .setColor(embed.Color(message))
        for(var i in ceelo.games[index].participants){
            var player = ceelo.games[index].participants[i]
            if(player[2] == -2){
                player[4] = 'No Turn'
            }else if(player[4] == '0'){
                player[4] = 'None'
                console.log(player)
            }
            Status_embed.addField(`**${master[ceelo.games[index].participants[i][0]].name}:**`, `Hand: ${player[4]} \nRoll Number: ${player[3]}`)    
        }    
        message.channel.send(Status_embed)
    }
}

function Ceelo_Basics(message){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var ceelo_basics = new Discord.RichEmbed()
    .setTitle('**Ceelo Basics**')
    .addField('**Rules:**', fs.readFileSync('./text_files/ceelo/ceelo_basics', 'utf-8'))
    .addField('**Hands from Best to Worst:**', fs.readFileSync('./text_files/ceelo/ceelo_hands', 'utf-8'))
    .setColor(embed.Color(message))
    message.channel.send(ceelo_basics)
}

function Ceelo_Help(message){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var ceelo_help = new Discord.RichEmbed()
    .setTitle('Ceelo Commands')
    .setDescription(fs.readFileSync('./text_files/ceelo/ceelo_commands.txt', 'utf-8'))
    .setColor(embed.Color(message))
    message.channel.send(ceelo_help)
}

function Ceelo_Reset(message, args){
    const fs = require('fs')
    var ceelo = JSON.parse(fs.readFileSync('./JSON/ceelo.json', 'utf-8'))
    var game = args[2] || 0
    if(450001712305143869 == message.author.id){
        var success = false
        for(var i in ceelo.games){
            if(i == game){
                delete ceelo.games[i]
                message.channel.send(`Game ${i} was reset`)
                var success = true
                fs.writeFileSync ("./JSON/ceelo.json", JSON.stringify(ceelo, null, 2), function(err) {
                    if (err) throw err;
                    console.log('complete');
                    }
                );
            }
        }
        if(success == false){
            message.channel.send('No game was reset')
        }
    }
}