module.exports = {
    name: 'roulette',
    description: 'lets multiple people play roulette',
    execute(message, args, money){
        const fs = require('fs')
        const Discord = require('discord.js')
        const roulette = JSON.parse(fs.readFileSync("./JSON/roulette.json", "utf-8"))
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        var bet_time = args[2];
        var command = args[1];

        switch(command){
            case 'bet':
                if(typeof(bets_open) == 'undefined'){
                    if(isNaN(args[2]) == false && bet_time >= 30 && bet_time <= 60){
                        bets_open = true
                        Display(message)
                        message.channel.send(`Bets are open. You have ${bet_time} seconds to place bets`)
                        setTimeout(function(){
                            //console.log(approved_bets)
                            //bets go, [bet amount, bet placement, bettor id]
                            //make special case for 0 not being even/odd or red/black
                            if(approved_bets.length > 0){  
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
                                setTimeout(function(){
                                    message.channel.send(`The number is: \n${number}${color}`)
                                    counter = 0
                                    bet_checker(approved_bets, number, roulette, message, master)
                                    delete counter
                                    delete approved_bets
                                }, 2000)
                            }else{
                                message.channel.send("No bets were made, the game is cancelled")
                                delete bets_open
                            }  
                        },bet_time * 1000)
                    }else{
                        message.channel.send('You must choose a time between 30 and 90 seconds')
                    }
                }else if(bets_open = true){
                    message.channel.send("Bets are already open")
                }
            break;
            case 'stats':
                //last 5 roulette spins
            break;
            case 'list':
                //list of possible bets and payouts
                Display(message)
            break;
            case 'help':
                //list of commands
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
        message.channel.send("Error Occured in Lottery.js Purchase");
    }
}

function bet_checker(approved_bets, picked_number, roulette, message, master){
    const fs = require('fs')
    var winnings = 0
    var bet = ''
    var value = ''
    var user = ''
    var command = ''
    var counter = 0
    for(j = 0; j < approved_bets.length; j++){
        bet = parseFloat(approved_bets[j][0])
        value = String(approved_bets[j][1]).toLowerCase()
        user = approved_bets[j][2]
        command = ''
        if(isNaN(value) == true){
            if(['even', 'odd', 'red', 'black'].includes(value)){
                command = value
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
                    message.channel.send(`${master[user].name} wins ${-winnings} gbp`)
                }
            break;
            case 'num':
                if(value == picked_number){
                    winnings = -36 * bet
                    purchase(winnings, user, master)
                    message.channel.send(`${master[user].name} wins ${-winnings} gbp`)
                }
            break;
            case 'even':
                if(roulette[picked_number].even == true){
                    winnings = -2 * bet
                    purchase(winnings, user, master)
                    message.channel.send(`${master[user].name} wins ${-winnings} gbp`)
                }
            break;
            case 'odd':
                if(roulette[picked_number].even == false){
                    winnings = -2 * bet
                    purchase(winnings, user, master)
                    message.channel.send(`${master[user].name} wins ${-winnings} gbp`)
                }
            break;
            case 'red':
                if(roulette[picked_number].red == true){
                    winnings = -2 * bet
                    purchase(winnings, user, master)
                    message.channel.send(`${master[user].name} wins ${-winnings} gbp`)
                }
            break;
            case 'black':
                if(roulette[picked_number].red == false){
                    winnings = -2 * bet
                    purchase(winnings, user, master)
                    message.channel.send(`${master[user].name} wins ${-winnings} gbp`)
                }
            break;
            case 'row':
                if(roulette[picked_number].row == value[3]){
                    winnings = -3 * bet
                    purchase(winnings, user, master)
                    message.channel.send(`${master[user].name} wins ${-winnings} gbp`)
                }
            break;
            case 'half':
                if(roulette[picked_number].row == value[4]){
                    winnings = -2 * bet
                    purchase(winnings, user, master)
                    message.channel.send(`${master[user].name} wins ${-winnings} gbp`)
                }
            break;
            case 'third':
                if(roulette[picked_number].third == value[5]){
                    winnings = -3 * bet
                    purchase(winnings, user, master)
                    message.channel.send(`${master[user].name} wins ${-winnings} gbp`)
                }
            break;
        }
        if(winnings !== 0){
            counter++
        }
    }
    if(counter !== 0){
        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }else{
        message.channel.send("No Winners")
    }
}
function Display(message){
    const Discord = require('discord.js')
    const fs = require('fs')
    var test = new Discord.Attachment('roulette.jpg')
    const display = new Discord.RichEmbed()
    .setTitle('**Roulette**')
    .addField("Basics","Minimum bet is 5gbp\nBets must be made in the blackjack chat\nBets are placed as such: [Bet Amount] [Bet Placement]\nRow number goes from bottom to top\nHalf/Third number goes left to right")
    .attachFile(test)
    .addField("Bet/Payouts", "0-36: 35 to 1\nRow: 3 to 1\nThird: 3 to 1\nHalf: 2 to 1\nEven/Odd: 2 to 1\nRed/Black: 2 to 1")
    message.channel.send(display)
}