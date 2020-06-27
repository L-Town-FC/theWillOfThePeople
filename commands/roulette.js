module.exports = {
    name: 'roulette',
    description: 'lets multiple people play roulette',
    execute(message, args, money){
        const fs = require('fs')
        const Discord = require('discord.js')
        var bet_time = 20;
        var command = args[1]
        var bet_amount = args[2]
        var bet_place = args[3]

        switch(command){
            case 'bet':
                if(typeof(bets_open) == 'undefined'){
                    bets_open = true
                    approved_bets = []
                    message.channel.send("Bets are open")
                    setTimeout(function(){
                        console.log(approved_bets)
                        //make special case for 0 not being even/odd or red/black
                        delete bets_open
                    },bet_time * 1000)
                }else if(bets_open = true){
                    message.channel.send("Bets are open")
                }
            break;
            case 'stats':

            break;
            case 'help':

            break;
        }
    }

}
