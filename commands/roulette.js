module.exports = {
    name: 'roulette',
    description: 'lets multiple people play roulette',
    execute(message, args, money){
        const fs = require('fs')
        const Discord = require('discord.js')
        const roulette = JSON.parse(fs.readFileSync("./JSON/roulette.json", "utf-8"))
        var bet_time = 15;
        var command = args[1]

        switch(command){
            case 'bet':
                if(typeof(bets_open) == 'undefined'){
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
                                for(i = 0; i < approved_bets.length; i++){
                                    console.log(approved_bets[i])
                                    bet_checker(approved_bets[i])
                                }
                                delete approved_bets
                            }, 2000)
                        }else{
                            message.channel.send("No bets were made, the game is cancelled")
                        }  
                    },bet_time * 1000)
                }else if(bets_open = true){
                    message.channel.send("Bets are already open")
                }
            break;
            case 'stats':
                //last 5 roulette spins
            break;
            case 'list':
                //list of possible bets and payouts
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
        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Lottery.js Purchase");
    }
}

function bet_checker(approved_bets, ){
    var bet = approved_bets[0]
    var value = String(approved_bets[1]).toLowerCase()
    var user = approved_bets[2]
    var command = ''
    if(isNaN(value) == true){
        if(['even', 'odd', 'red', 'black'].includes(value)){
            command = value
        }else{
            command = value.slice(0,-1)   
        }
    }else{
        command = 'num'
    }
    switch(command){
        case 'num':
            console.log(command)
        break;
        case 'even':
            console.log(command)
        break;
        case 'odd':
            console.log(command)
        break;
        case 'red':
            console.log(command)
        break;
        case 'black':
            console.log(command)
        break;
        case 'row':
            console.log(command)
        break;
        case 'half':
            console.log(command)
        break;
        case 'third':
            console.log(command)
        break;

    }
}
function Display(message){
    const Discord = require('discord.js')
    const fs = require('fs')
    var bets = fs.readFileSync('./text_files/possible_bets','utf-8')
    var test = new Discord.Attachment('roulette.jpg')
    const display = new Discord.RichEmbed()
    .setTitle('**Roulette**')
    .addField("Basics","Minimum bet is 5gbp\nBets are placed as such: [Bet Amount] [Bet Placement]")
    .attachFile(test)
    .addField("Possible Bet Placements", bets)
    message.channel.send(display)
}