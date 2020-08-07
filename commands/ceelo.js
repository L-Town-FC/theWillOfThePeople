module.exports = {
    name: 'ceelo',
    description: 'lets you play ceelo with others',
    execute(message, args, master, stats_list, tracker){
        
        const fs = require('fs')
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        var command = args[1] || 'default'

        switch(command){
            case 'start':
                //!ceelo start [bet] Initiates game with specified bet
                //creates timer for others to join and then closes so people can't join midgame
                Ceelo_Start(message, args, master)
            break;
            case 'join':
                //lets people join the game before it closes
                Ceelo_Join(message, master)
            break;
            case 'leave':
                //lets people leave the game before it closes
                Ceelo_Leave(message, args, ceelo_players, master)
            break;
            case 'roll':
                //lets you roll the dice
                Ceelo_Roll(message, args, ceelo_players, master)
            break;
            case 'wash':
                //lets you roll the dice but they don't count
                Ceelo_Wash(message, args, ceelo_players, master)
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

function Ceelo_Start(message, args, master){
    const min_bet = 15
    var time = 15
    
    if(typeof(ceelo_players) !== 'undefined'){
        message.channel.send('Game is already ongoing')
    }else if(isNaN(args[2]) == true){
        message.channel.send('Please give a valid bet amount')
    }else if(args[2] < min_bet){
        message.channel.send(`The minimum bet is ${min_bet} gbp`)
    }else if(parseFloat(args[2]) > master[message.author.id].gbp){
        message.channel.send("You don't have enough gbp for that bet")
    }else{
        ceelo_players = []
        ceelo_bet = args[2]
        ceelo_players.push([message.author.id, 0])
        game_join = true
        message.channel.send(`Players have ${time} seconds to join the game`)
        message.channel.send(`${master[message.author.id].name} joined the game`)
        setTimeout(function(){
            if(ceelo_players.length > 1){
                game_start = true
            }else{
                message.channel.send('Not enough people. Game cancelled')
                delete ceelo_players
                delete game_join
            }
        }, time * 1000)
    }
}

function Ceelo_Join(message, master){
    if(typeof(game_join) == 'undefined'){
        message.channel.send('There is no game to join')
    }else if(typeof(game_start) !== 'undefined'){
        message.channel.send("You can't join because the game has already started")
    }else if(master[message.author.id].gbp < ceelo_bet){
        message.channel.send(`You must have atleast ${ceelo_bet} gbp to play this hand`)
    }else if(2 !== 2){
        //change it so same player can't join twice
    }else{
        console.log(ceelo_players)
        ceelo_players.push([message.author.id, 0])
        console.log(ceelo_players)
        message.channel.send(`${master[message.author.id].name} joined the game`)
    }
}

function Ceelo_Leave(message, args, ceelo_players, master){
    
}

function Ceelo_Roll(message, args, ceelo_players, master){
    //Starts by saying whos turn it is to roll
    //they have 15 seconds to roll or wash
    //once they roll, change the second number in the pair to 1
    //after everyone has rolled, compare scores and assign winner
    //in event of tie, reset
    //once winner has been decided, clear ceelo_players and game_start
}

function Ceelo_Wash(message, args, ceelo_players, master){
    
}

function Ceelo_Basics(message){

}

function Ceelo_Help(message){

}