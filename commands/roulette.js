module.exports = {
    name: 'roulette',
    description: 'lets multiple people play roulette',
    execute(message, args, money){
        const fs = require('fs')
        const Discord = require('discord.js')
        var bet_time = 15;
        var command = args[1]

        switch(command){
            case 'bet':
                if(typeof(bets_open) == 'undefined'){
                    bets_open = true
                    message.channel.send(`Bets are open. You have ${bet_time} seconds to place bets`)
                    setTimeout(function(){
                        console.log(approved_bets)
                        //bets go, [bet amount, bet placement, bettor id]
                        //make special case for 0 not being even/odd or red/black
                        if(approved_bets.length > 0){  
                            message.channel.send('Bets are closed')
                            setTimeout(function(){
                                var number = Math.floor(Math.random()*37)
                                message.channel.send(number)
                            }, 2000)
                        }else{
                            message.channel.send("No bets were made, the game is cancelled")
                        }
                        delete bets_open
                        delete approved_bets
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