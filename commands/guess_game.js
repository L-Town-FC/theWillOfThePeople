module.exports = {
    name: 'guessgame',
    description: 'guess the correct number within three tries and get 10x payout',
    execute(message, args, total_money){
        const fs = require('fs');
        const Discord = require('discord.js');
        const min_bet = 25;
        var bet = args[2];

        
        switch(args[1]){
            case 'bet':
                if (is_Ongoing()[0] == 'true'){
                    message.channel.send(`${is_Ongoing[1]} is currently playing and is on guess ${is_Ongoing[2]}`)
                }else if (typeof(bet) == 'string' && parseFloat(bet) >= min_bet && parseFloat(bet) < parseFloat(total_money)){
                    message.channel.send("Your bet is accepted. Please guess the number between 0 and 100. You have 3 guesses")
                }else{
                    message.channel.send(`Please place a valid bet of ${min_bet} or greater gbp`)
                }
            break;
            case 'guess':

            break;
            case 'status':

            break;
        }


    }

    
}

function is_Ongoing() {
    const fs = require('fs');
    const Discord = require('discord.js');
    var number = fs.readFileSync('./text_files/guessgame.txt','utf8').split(" ");
    var user_and_currency = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
    var user_money = [];
    var array = [];
    var player = number[2];
    var name = "";
    var guess_number = number[0];

    for (i = 0; i < user_and_currency.length; i++) {
        user_money[i] = user_and_currency[i].split(" ");
    }

    for (i = 0; i < user_money.length; i++) {
        array[i] = {discrim: user_money[i][0],
                    name: user_money[i][1],
                    money: user_money[i][2]}
    }

    for (i = 0; i < array.length; i++) {
        if(array[i].discrim == player){
            name = array[i].name;
        }
    }


    if(guess_number > 0){
        var status = [true, name, guess_number];
        return status
    }else{
        var status = [false, "", guess_number];
    }

}