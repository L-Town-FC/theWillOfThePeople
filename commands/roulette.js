module.exports = {
    name: 'roulette',
    description: 'lets multiple people play roulette',
    execute(message, args, master, tracker, stats_list){
        const fs = require('fs')
        const roulette = JSON.parse(fs.readFileSync("./JSON/roulette.json", "utf-8"))
        const embed = require('./Functions/embed_functions')
        var bet_time = args[2];
        var command = args[1];

        switch(command){
            case 'bet':
                try{
                    if(typeof(bets_open) == 'undefined'){
                        if(isNaN(args[2]) == false && bet_time >= 15 && bet_time <= 120){
                            bets_open = true
                            Display(message, embed)
                            message.channel.send(`Bets are open. You have ${bet_time} seconds to place bets`)
                            setTimeout(function(){
                                //console.log(approved_bets)
                                //bets go, [bet amount, bet placement, bettor id]
                                //make special case for 0 not being even/odd or red/black
                                if(typeof(approved_bets) !== 'undefined' && approved_bets.length > 0){  
                                    delete bets_open
                                    message.channel.send('Bets are closed')
                                    var number = Math.floor(Math.random()*37)
                                    if(number == '0'){
                                        var color = ':green_circle:'
                                    }else if(roulette[number].red == true){
                                        var color = ':red_circle:'
                                    }else{
                                        var color = ':black_circle:'
                                    }
                                    Update_numbers(number + color)
                                    setTimeout(function(){
                                        try{
                                            message.channel.send(`The number is: \n${number}${color}`)
                                            counter = 0
                                            bet_checker(approved_bets, number, roulette, message, master, tracker, stats_list)
                                            delete counter
                                            if(typeof(approved_bets) == 'undefined'){
                                                approved_bets = []
                                            }
                                            delete approved_bets
                                        }catch(err){
                                            console.log(err)
                                            message.channel.send("Error occurred in roulette.js")
                                        }
                                    }, 2000)
                                }else{
                                    message.channel.send("No bets were made, the game is cancelled")
                                    delete bets_open
                                }  
                            },bet_time * 1000)
                        }else{
                            message.channel.send('You must choose a time between 15 and 120 seconds')
                        }
                    }else if(bets_open = true){
                        message.channel.send("Bets are already open")
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in Roulette.js bet')
                }
            break;
            case 'numbers':
                //last 10 roulette spins
                try{
                    Numbers(message, embed)
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in roulette.js numbers")
                }
            break;
            case 'list':
                //list of possible bets and payouts
                try{
                    Display(message, embed)
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in roulette.js list")
                }
            break;
            case 'help':
                //list of commands
                try{
                    Help(message, embed)
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in roulette.js help")
                }
            break;
            default:
                message.channel.send(`Use "!roulette help" for a list of commands`)
        }
    }

}
function purchase(bet_value, player, master) {
    try{
        const fs = require('fs');

        for(i in master){
            if(player == i){
                master[i].gbp = parseFloat(master[i].gbp) - parseFloat(bet_value)
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in roulette.js Purchase");
    }
}

function bet_checker(approved_bets, picked_number, roulette, message, master, tracker, stats_list){
    const fs = require('fs')
    const unlock = require('./Functions/Achievement_Functions')
    var winnings = 0
    var bet = ''
    var value = ''
    var user = ''
    var command = ''
    var counter = 0
    try{
        for(j = 0; j < approved_bets.length; j++){
            var win_checker = 0
            bet = parseFloat(approved_bets[j][0])
            value = String(approved_bets[j][1]).toLowerCase()
            user = approved_bets[j][2]
            command = ''
            if(isNaN(value) == true){
                if(['even', 'odd', 'red', 'black'].includes(value)){
                    command = value
                }else if(value.startsWith('r') == true && value[1] !== 'o'){
                    command = 'misc'
                }else if(value.startsWith('c') == true){
                    command = 'misc'
                }else if(value.startsWith('d') == true){
                    command = 'misc'
                }else{
                    command = value.slice(0,-1)   
                }
            }else{
                command = 'num'
                if(picked_number == 0){
                    command = 'zero'
                }
            }
            switch(command){
                case 'zero':
                    if(value == picked_number){
                        winnings = -36 * bet
                        purchase(winnings, user, master)
                        message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                        unlock.tracker2(user, 42, 0, message, master, tracker)
                        win_checker++
                    }
                break;
                case 'num':
                    if(value == picked_number){
                        winnings = -36 * bet
                        purchase(winnings, user, master)
                        message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                        unlock.tracker2(user, 42, 0, message, master, tracker)
                        win_checker++
                    }
                break;
                case 'even':
                    if(picked_number !== 0 && roulette[picked_number].even == true ){
                        winnings = -2 * bet
                        purchase(winnings, user, master)
                        message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                        unlock.tracker2(user, 42, 6, message, master, tracker)
                        win_checker++
                    }
                break;
                case 'odd':
                    if(picked_number !== 0 && roulette[picked_number].even == false){
                        winnings = -2 * bet
                        purchase(winnings, user, master)
                        message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                        unlock.tracker2(user, 42, 6, message, master, tracker)
                        win_checker++
                    }
                break;
                case 'red':
                    if(picked_number !== 0 && roulette[picked_number].red == true){
                        winnings = -2 * bet
                        purchase(winnings, user, master)
                        message.channel.send(`${master[user].name} wins ${-winnings- bet} gbp`)
                        unlock.tracker2(user, 42, 7, message, master,tracker)
                        win_checker++
                    }
                break;
                case 'black':
                    if(picked_number !== 0 && roulette[picked_number].red == false){
                        winnings = -2 * bet
                        purchase(winnings, user, master)
                        message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                        unlock.tracker2(user, 42, 7, message, master, tracker)
                        win_checker++
                    }
                break;
                case 'row':
                    if(picked_number !== 0 && roulette[picked_number].row == value[3]){
                        winnings = -3 * bet
                        purchase(winnings, user, master)
                        message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                        unlock.tracker2(user, 42, 3, message, master, tracker)
                        win_checker++
                    }
                break;
                case 'half':
                    if(picked_number !== 0 && roulette[picked_number].half == value[4]){
                        winnings = -2 * bet
                        purchase(winnings, user, master)
                        message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                        unlock.tracker2(user, 42, 5, message, master,tracker)
                        win_checker++
                    }
                break;
                case 'third':
                    if(picked_number !== 0 && roulette[picked_number].third == value[5]){
                        winnings = -3 * bet
                        purchase(winnings, user, master)
                        message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                        unlock.tracker2(user, 42, 4, message, master,tracker)
                        win_checker++
                    }
                break;
                case 'misc':
                    if(picked_number !== 0 && roulette[picked_number].misc.includes(value) == true){
                        if(value[0] == 'r' || value[0] == 'c'){
                            winnings = -18 * bet
                            purchase(winnings, user, master)
                            message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                            unlock.tracker2(user, 42, 1, message, master, tracker)
                            win_checker++
                        }else if(value[0] == 'd'){
                            winnings = -9 * bet
                            purchase(winnings, user, master)
                            message.channel.send(`${master[user].name} wins ${-winnings - bet} gbp`)
                            unlock.tracker2(user, 42, 2, message, master, tracker)
                            win_checker++
                        }
                    }
                break;
            }
            if(winnings !== 0){
                counter++
            }
            if(win_checker !== 0){
                unlock.tracker1(user, 33, parseFloat(-winnings - bet), message, master, tracker)
                unlock.tracker3(user, 39, 2, parseFloat(-winnings - bet), message, master, tracker)
                stats_list[user].roulette_wins += 1
            }else{
                unlock.tracker1(user, 32, parseFloat(bet), message, master, tracker)
            }
        }
        if(counter == 0){
            message.channel.send("No Winners")
        }else{
            fs.writeFile ("./JSON/master.json", JSON.stringify(master), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            fs.writeFileSync ("./JSON/achievements_tracker.json", JSON.stringify(tracker, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in roulette.js bet checker')
    }
}
function Display(message, embed){
    const Discord = require('discord.js')
    const fs = require('fs')
    var basics = fs.readFileSync('./text_files/roulette/roulette_basics')
    var payouts = fs.readFileSync('./text_files/roulette/roulette_payouts')

    const dir = './text_files/roulette/'
    if(fs.readdirSync(dir).includes('roulette.jpg') == true){
        var board = new Discord.Attachment('./text_files/roulette/roulette.jpg')
    }else if(fs.readdirSync(dir).includes('roulette.JPG') == true){
        var board = new Discord.Attachment('./text_files/roulette/roulette.JPG')
    }

    const display = new Discord.MessageEmbed()
    .setTitle('**Roulette**')
    .addField("Basics:",basics)
    .addField("Bet/Payouts:", payouts)
    .setColor(embed.Color(message))
    message.channel.send(board)
    message.channel.send(display)
}

function Numbers(message,embed){
    const Discord = require('discord.js')  
    const fs = require('fs')
    var numbers = fs.readFileSync('./text_files/roulette/roulette_numbers.txt')
    var numbers_embed = new Discord.MessageEmbed()
    .setTitle('Last 10 Numbers')
    .setDescription(numbers)
    .setColor(embed.Color(message))
    message.channel.send(numbers_embed)
}

function Update_numbers(number){
    const fs = require('fs')
    try{
        var old_numbers = fs.readFileSync('./text_files/roulette/roulette_numbers.txt','utf-8').split(",")
        var new_numbers = []
        for(i = 1;i < 10; i++){
            new_numbers[i-1] = old_numbers[i]
        }
        
        new_numbers.push(number)
        fs.writeFileSync('./text_files/roulette/roulette_numbers.txt', new_numbers)
    }catch(err){
        console.log(err)
        message.channel.send('Error occured in roulette.js Update_Numbers')
    }
}

function Help(message, embed){
    const fs = require('fs')
    const Discord = require('discord.js')
    var help = fs.readFileSync('./text_files/roulette/roulette_commands.txt','utf-8')
    help_embed = new Discord.MessageEmbed()
    .setTitle('List of Roulette Commands')
    .setDescription(help)
    .setColor(embed.Color(message))
    message.channel.send(help_embed)
}