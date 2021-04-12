module.exports = {
    name: 'powerball',
    description: 'enters you into the lottery for big money',
    execute(message,args,total_money, master, stats_list, tracker, command_stats){
        const Discord = require('discord.js');
        const embed = require('./Functions/embed_functions')
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        const stats = require('./Functions/stats_functions')
        const base_winnings = 10000
        var command = args[1];
        var amount = args[2];
        var price = 5;
        var money_spent = price * parseInt(amount);

        switch(command){
            case 'buy':
                try{
                    if(amount <= 0){
                        message.channel.send("Please choose a number of tickets greater than 0")
                    }else if(isNaN(amount) == true){
                        
                        if(price <= total_money){
                            purchase(price, message.author.id, master);
                            stats.tracker(message.author.id, 1, 1,stats_list)
                            unlock.tracker1(message.author.id, 31, 1, message, master, tracker)
                            if(attempt(1, price, command_stats, message) == true){
                                message.channel.send(`Congradulations. You won Powerball. It took ${command_stats.powerball.tickets} tickets to win. Your prize is ${command_stats.powerball.pot}`)
                                purchase(-1 * command_stats.powerball.pot, message.author.id, master);
                                command_stats.powerball.tickets = 0
                                command_stats.powerball.pot = base_winnings
                                unlock.unlock(message.author.id, 10, message, master)
                            }else{
                                message.channel.send("Sorry. Try again");
                            }
                        }else{
                            message.channel.send(`You need at least ${price} gbp for this command`)
                        }

                    }else if(parseInt(amount) !== parseFloat(amount)){
                        message.channel.send("Please choose a whole number for the amount of tickets");
                    }else{
                        if(money_spent <= total_money){
                            stats.tracker(message.author.id, 1, parseFloat(amount), stats_list)
                            unlock.tracker1(message.author.id, 31, parseInt(amount), message, master, tracker)
                            purchase(amount*price, message.author.id, master);
                            if(attempt(amount, money_spent, command_stats, message) == true){
                                message.channel.send(`Congradulations. You won Powerball. It took ${command_stats.powerball.tickets} tickets to win. Your prize is ${command_stats.powerball.pot} gbp`)
                                purchase(-1 * command_stats.powerball.pot, message.author.id, master);
                                command_stats.powerball.tickets = 0
                                command_stats.powerball.pot = base_winnings
                                unlock.unlock(message.author.id, 10, message, master)
                            }else{
                                message.channel.send("Sorry. Try again");
                            }
                        }else{
                            message.channel.send(`You need at least ${money_spent} gbp to buy ${amount} tickets`);
                        }
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in Powerball.js Buy");
                }
            break;

            case 'stats':
                try{
                    var num_of_guesses = command_stats.powerball.tickets;
                    var total_pot = command_stats.powerball.pot;
                    message.channel.send(`The pot is currently at ${total_pot} gbp. ${num_of_guesses} tickets have been bought.`)
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in Powerball.js Stats");
                }
            break;
            
            case 'help':
                try{
                    var lottery_commands = fs.readFileSync('./text_files/lottery_commands.txt','utf8');
                    const help_embed = new Discord.MessageEmbed()
                    .addField('List of Commands', lottery_commands)
                    .setColor(embed.Color(message))
                    message.channel.send(help_embed);
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in Powerball.js Help");
                }
            break;

            default:
                message.channel.send("Use !powerball help for a list of commands");
        }
    }

}

function attempt(amount, money_spent, command_stats, message){
    try{
        const fs = require('fs');
        const Discord = require('discord.js');
        var tickets = [];
        var max_guesses = 10000
        var remaining_numbers = parseInt(max_guesses) - parseInt(command_stats.powerball.tickets);

        for(i = 0; i < amount; i++){
            tickets[i] = Math.ceil(Math.random()*remaining_numbers);
            var duplicate = true;
            while(duplicate == true){
                if(find_duplicate_in_array(tickets) == []){
                    duplicate = false;
                }else{
                    duplicate = false;
                    tickets[i] = Math.ceil(Math.random()*remaining_numbers);
                }
            }
        }

        if(tickets.includes(1) == true){
            command_stats.powerball.tickets = parseInt(command_stats.powerball.tickets) + parseInt(amount);
            command_stats.powerball.pot = parseInt(command_stats.powerball.pot) + (parseInt(money_spent) * (4/5));
            return true
        }else{
            command_stats.powerball.tickets = parseInt(command_stats.powerball.tickets) + parseInt(amount);
            command_stats.powerball.pot = parseInt(command_stats.powerball.pot) + (parseInt(money_spent) * (4/5));
            return false
        }

        function find_duplicate_in_array(arra1) {
            const object = {};
            const result = [];

            arra1.forEach(item => {
            if(!object[item])
                object[item] = 0;
                object[item] += 1;
            })

            for (const prop in object) {
            if(object[prop] >= 2) {
                result.push(prop);
            }
            }

            return result;
        }
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in Powerball.js Attempt");
    }
        
}

function purchase(bet_value, player, master) {
    try{
        master[player].gbp = parseFloat(master[player].gbp) - parseFloat(bet_value)

    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in Powerball.js Purchase");
    }
}