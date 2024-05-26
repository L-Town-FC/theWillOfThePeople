module.exports = {
    name: 'gg',
    description: 'guess the correct number within three tries and get 10x payout',
    execute(message, args, total_money, master, stats_list, tracker){
        const Discord = require('discord.js');
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        const stats = require('./Functions/stats_functions')
        const embed = require('./Functions/embed_functions')
        const min_bet = 5;
        var bet = args[2];
        var person = message.author.id;
        var magic_number = fs.readFileSync('./text_files/guessgame/guessgame.txt','utf8').split(" ")[1];
        var bet2 = fs.readFileSync('./text_files/guessgame/guessgame.txt','utf8').split(" ")[3];
        var result = false;
        var num_of_guesses = fs.readFileSync('./text_files/guessgame/guessgame.txt','utf8').split(" ")[0];
        var payout = 20
        var command = args[1] || 'none'
        if(parseFloat(args[1]) == parseInt(args[1])){
            if(parseInt(args[1]) > 0 && parseInt(args[1]) <= 100){
                command = 'guess'
            }
        }

        switch(command){
            case 'bet':
                try{
                    if(is_Ongoing(master)[0] == true){
                        message.channel.send(`${master[is_Ongoing(master)[1]].name} is currently playing and is on guess ${is_Ongoing(master)[2]}`)
                    }else if(typeof(bet) == 'string' && parseFloat(bet) >= min_bet && parseFloat(bet) <= parseFloat(total_money)){
                        message.channel.send("Your bet is accepted. Please guess the number between 0 and 100. You have 3 guesses");
                        first_guess(person, bet);
                        purchase(bet, message.author.id, master);
                    }else if(parseFloat(total_money) < parseFloat(bet)){
                        message.channel.send("You don't have enough gbp for that bet")
                    }else if(String(bet).toLowerCase() == 'all'){
                        message.channel.send(`Your bet was ${master[person].gbp}. Please guess the number between 0 and 100. You have 3 guesses`);
                        first_guess(person, parseFloat(master[person].gbp));
                        purchase(parseFloat(master[person].gbp), person, master);
                    }else{
                        message.channel.send(`Please place a valid bet of ${min_bet} gbp or greater`)
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in guessgame.js Bet");
                }

            break;
            case 'guess':
                try{
                    if (is_Ongoing(master)[0] == true){
                        result = update_guesses(parseFloat(args[1]),message);
                    }else{
                        message.channel.send('Noone is currently playing');
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in guessgame.js Guess");
                }

            break;
            case 'status':
                try{
                    if (is_Ongoing(master)[0] == false){
                        message.channel.send('Noone is currently playing')
                    }else{
                        message.channel.send(`${master[is_Ongoing(master)[1]].name} is currently playing and is on guess number ${num_of_guesses}`)
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in guessgame.js Bet");
                }

            break;
            case 'help':
                try{
                    var guessgame_commands = fs.readFileSync('./text_files/guessgame/guessgame_commands.txt','utf8');
                    const help_embed = new Discord.MessageEmbed()
                    .addField('List of Commands', guessgame_commands)
                    .setColor(embed.Color(message))
                    message.channel.send(help_embed);
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in guessgame.js Help");
                }

            break;
            default:
                message.channel.send('Use the command "!gg help" for a list of commands');
        }
        try{
            if(is_Ongoing(master)[2] >= 4 || result == true){
                if(result == false){
                    message.channel.send(`You are out of guesses. You lose. The correct number was ${magic_number}`);
                    
                    //The House Always Wins Achievement
                    unlock.tracker1(message.author.id, 32, parseFloat(bet2), message, master, tracker)
                    
                    stats.tracker(message.author.id, 6, 1, stats_list)
                    fs.writeFileSync('./text_files/guessgame/guessgame.txt', `0 0 0 0`);
                }else{
                    message.channel.send(`You win ${payout * parseFloat(bet2)} gbp`);
                    purchase((-payout * parseFloat(bet2)), message.author.id, master);
                    
                    //Professional Gambler Achievement
                    unlock.tracker1(message.author.id, 33, parseFloat(payout * bet2), message, master, tracker)
                    
                    fs.writeFileSync('./text_files/guessgame/guessgame.txt', `0 0 0 0`);
                    
                    //Psychic Achievement
                    unlock.tracker1(message.author.id, 4, 1, message, master, tracker)
                    
                    //Jack of All Trades Achievement
                    unlock.tracker3(message.author.id, 39, 1, payout * parseFloat(bet2), message, master, tracker)
                    
                    stats.tracker(message.author.id, 5, 1, stats_list)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in guessgame.js");
        }
    }

    
}

function is_Ongoing(master) {
    try{
        const fs = require('fs');
        var number = fs.readFileSync('./text_files/guessgame/guessgame.txt','utf8').split(" ");
        var player = number[2];
        var name = "";
        var guess_number = number[0];

        for (i in master) {
            if(i == player){
                name = player
            }
        }


        if(guess_number > 0){
            var status = [true, name, guess_number];
            return status
        }else{
            var status = [false, "", guess_number];
            return status
        }
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in guessgame.js Is_Ongoing");
    }
}

function update_guesses(guess,message){
    const fs = require('fs');
    const Discord = require('discord.js');
    var number = fs.readFileSync('./text_files/guessgame/guessgame.txt','utf8').split(" ");
    var num_of_guesses = number[0];
    var magic_number = number[1];
    var player = number[2];
    var bet = number[3];

    try{
        if(parseInt(guess) >= 0 && parseInt(guess) <= 100){
            if(parseInt(guess) > magic_number){
                num_of_guesses = parseInt(num_of_guesses) + 1;
                if(num_of_guesses <= 2){
                    plural = "es"
                }else{
                    plural = ""
                }
                message.channel.send(`The correct number is lower than your guess. You have ${4 - parseInt(num_of_guesses)} guess${plural} remaining`)
                fs.writeFileSync('./text_files/guessgame/guessgame.txt', `${num_of_guesses} ${magic_number} ${player} ${bet}`);
                return false
            }else if(parseInt(guess) < magic_number){
                num_of_guesses = parseInt(num_of_guesses) + 1;
                if(num_of_guesses <= 2){
                    plural = "es"
                }else{
                    plural = ""
                }
                message.channel.send(`The correct number is higher than your guess. You have ${4 - parseInt(num_of_guesses)} guess${plural} remaining`)
                fs.writeFileSync('./text_files/guessgame/guessgame.txt', `${num_of_guesses} ${magic_number} ${player} ${bet}`);
                return false
            }else{
                num_of_guesses = parseInt(num_of_guesses) + 1;
                message.channel.send("Congratulations. You guessed the correct number");
                fs.writeFileSync('./text_files/guessgame/guessgame.txt', `${num_of_guesses} ${magic_number} ${player} ${bet}`);
                return true
            }        
        }else{
            message.channel.send('Please guess a valid number between 0 and 100')
        }
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in guessgame.js Update_Guesses");
    }
}

function first_guess(player, bet){
    try{
        const fs = require('fs');
        const Discord = require('discord.js');
        var magic_number = Math.ceil(Math.random()*100);

        var updated_status = `1 ${magic_number} ${player} ${bet}`
        fs.writeFileSync('./text_files/guessgame/guessgame.txt', updated_status);
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in guessgame.js First_guess");
    }
}

function purchase(bet_value, player, master) {
    try{
        master[player].gbp = parseFloat(master[player].gbp) - parseFloat(bet_value)

    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in guessgame.js Purchase");
    }

}