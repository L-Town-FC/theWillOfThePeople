module.exports = {
    name: 'guessgame',
    description: 'guess the correct number within three tries and get 10x payout',
    execute(message, args, total_money){
        const cheerio = require('cheerio');
        const request = require('request');
        const Discord = require('discord.js');
        const fs = require('fs');
        const min_bet = 25;
        var bet = args[2];
        var person = message.author.discriminator;
        var guess = args[2];
        var magic_number = fs.readFileSync('./text_files/guessgame.txt','utf8').split(" ")[1];
        var bet2 = fs.readFileSync('./text_files/guessgame.txt','utf8').split(" ")[3];
        var result = false;


        switch(args[1]){
            case 'bet':
                if (is_Ongoing()[0] == true){
                    message.channel.send(`${is_Ongoing()[1]} is currently playing and is on guess ${is_Ongoing()[2]}`)
                }else if (typeof(bet) == 'string' && parseFloat(bet) >= min_bet && parseFloat(bet) < parseFloat(total_money)){
                    message.channel.send("Your bet is accepted. Please guess the number between 0 and 100. You have 3 guesses");
                    first_guess(person, bet);
                }else{
                    message.channel.send(`Please place a valid bet of ${min_bet} gbp or greater`)
                }
            break;
            case 'guess':
                if (is_Ongoing()[0] == true){
                    result = update_guesses(guess,message);
                }else{
                    message.channel.send('Noone is currently playing');
                }
            break;
            case 'status':
                if (is_Ongoing()[0] == false){
                    message.channel.send('Noone is currently playing')
                }
            break;
        }

        if(is_Ongoing()[2] >= 4 || result == true){
            if(result == false){
                message.channel.send(`You are out of guesses. You lose. The correct number was ${magic_number}`);
                fs.writeFileSync('./text_files/guessgame.txt', `0 0 0 0`);
            }else{
                message.channel.send(`You win ${10 * parseInt(bet2)} gbp`);
                fs.writeFileSync('./text_files/guessgame.txt', `0 0 0 0`);
            }
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
        return status
    }
}

function update_guesses(guess,message){
    const fs = require('fs');
    const Discord = require('discord.js');
    var number = fs.readFileSync('./text_files/guessgame.txt','utf8').split(" ");
    var num_of_guesses = number[0];
    var magic_number = number[1];
    var player = number[2];
    var bet = number[3];

    if(parseInt(guess) >= 0 && parseInt(guess) <= 100){
        if(parseInt(guess) > magic_number){
            num_of_guesses = parseInt(num_of_guesses) + 1;
            if(num_of_guesses <= 2){
                plural = "es"
            }else{
                plural = ""
            }
            message.channel.send(`The correct number is lower than your guess. You have ${4 - parseInt(num_of_guesses)} guess${plural} remaining`)
            fs.writeFileSync('./text_files/guessgame.txt', `${num_of_guesses} ${magic_number} ${player} ${bet}`);
            return false
        }else if(parseInt(guess) < magic_number){
            num_of_guesses = parseInt(num_of_guesses) + 1;
            if(num_of_guesses <= 2){
                plural = "es"
            }else{
                plural = ""
            }
            message.channel.send(`The correct number is higher than your guess. You have ${4 - parseInt(num_of_guesses)} guess${plural} remaining`)
            fs.writeFileSync('./text_files/guessgame.txt', `${num_of_guesses} ${magic_number} ${player} ${bet}`);
            return false
        }else{
            num_of_guesses = parseInt(num_of_guesses) + 1;
            message.channel.send("Congratulations. You guessed the correct number");
            fs.writeFileSync('./text_files/guessgame.txt', `${num_of_guesses} ${magic_number} ${player} ${bet}`);
            return true
        }        
    }else{
        message.channel.send('Please guess a valid number between 0 and 100')
    }
}

function first_guess(player, bet){
    const fs = require('fs');
    const Discord = require('discord.js');
    var number = fs.readFileSync('./text_files/guessgame.txt','utf8').split(" ");
    var magic_number = Math.ceil(Math.random()*100);

    var updated_status = `1 ${magic_number} ${player} ${bet}`
    fs.writeFileSync('./text_files/guessgame.txt', updated_status);

}