const { type } = require('os')
const { join } = require('path')

module.exports = {
    name: 'ceelo',
    description: 'lets you play ceelo with others',
    execute(message, args, master, stats_list, tracker){
        
        const fs = require('fs')
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        var command = args[1] || 'default'
        ceelo = JSON.parse(fs.readFileSync('./JSON/ceelo.json', 'utf-8'))

        switch(command){
            case 'start':
                //!ceelo start [bet] Initiates game with specified bet
                //creates timer for others to join and then closes so people can't join midgame
                Ceelo_Start(message, args, ceelo, master)
            break;
            case 'join':
                //lets people join the game before it closes
                Ceelo_Join(message, ceelo, master)
            break;
            case 'leave':
                //lets people leave the game before it closes
                Ceelo_Leave(message, args, ceelo, master)
            break;
            case 'roll':
                //lets you roll the dice
                Ceelo_Roll(message, args, ceelo, master)
            break;
            case 'wash':
                //lets you roll the dice but they don't count
                Ceelo_Wash(message, args, ceelo, master)
            break;
            case 'basics':
                //Shows the the hand rankings
                Ceelo_Basics(message)
            break;
            case 'help':
                //List of commands
                Ceelo_Help(message)
            break;
            case 'reset':
                //lets me reset the game if necessary
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
                ceelo.games[i] = {
                    "participants" : [[message.author.id ,0 , 0]],
                    "bet": parseFloat(bet),
                    "game_start": false,
                    "game_over": false,
                }
            }else{
                for(var i in ceelo.games){
                    if(ceelo.games[i].participants.includes(message.author.id)){
                        //var inGame = true
                        //uncomment this out so you can only join 1 game at a time
                    }
                }
                if(typeof(inGame) === 'undefined'){
                    i = parseInt(i) + 1
                    ceelo.games[i] = {
                        "participants" : [[message.author.id ,0 , 0]],
                        "bet": parseFloat(bet),
                        "game_start": false,
                        "game_over": false
                    }
                }
            }
            if(typeof(i) !== 'undefined'){
                setTimeout(function(){
                    var ceelo2 = JSON.parse(fs.readFileSync('./JSON/ceelo.json', 'utf-8'))
                    if(ceelo2.games[i].participants.length > 1){
                        ceelo2.games[i].game_start = true
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
                    //var inGame = true
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
                ceelo.games[join_index].participants.push([message.author.id ,0 , 0])
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

function Ceelo_Leave(message, args, ceelo, master){
    
}

function Ceelo_Roll(message, args, ceelo, master){
    //Starts by saying whos turn it is to roll
    //they have 15 seconds to roll or wash
    //once they roll, change the second number in the pair to 1
    //after everyone has rolled, compare scores and assign winner
    //in event of tie, reset
    //once winner has been decided, clear ceelo_players and game_start
}

function Ceelo_Wash(message, args, ceelo, master){
    
}

function Ceelo_Basics(message){

}

function Ceelo_Help(message){

}