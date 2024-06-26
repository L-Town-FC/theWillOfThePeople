module.exports = {
    name: 'powerball',
    description: 'enters you into the lottery for big money',
    execute(message,args,total_money, master, stats_list, tracker, command_stats){
        const embed = require('./Functions/embed_functions')
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        const stats = require('./Functions/stats_functions')
        const general = require('./Functions/GeneralFunctions')
        const base_winnings = 10000
        var command = args[1];
        var amount = args[2];
        var price = 5;
        var moneySpent = price * parseInt(amount);

        switch(command){
            case 'buy':
                try{
                    if(amount <= 0){
                        message.channel.send("Please choose a number of tickets greater than 0")
                    }else if(isNaN(amount) == true){
                        
                        if(price <= total_money){
                            general.CommandPurchase(message, master, price, general.defaultRecipient)
                            stats.tracker(message.author.id, 1, 1,stats_list)

                            //Sorry. Try Again Achievement
                            unlock.tracker1(message.author.id, 31, 1, message, master, tracker)
                            
                            //WINNING CONDITION
                            if(attempt(1, price, command_stats, message) == true){
                                message.channel.send(`Congradulations. You won Powerball. It took ${command_stats.powerball.tickets} tickets to win. Your prize is ${command_stats.powerball.pot}`)
                                general.CommandPurchase(message, master, -1 * command_stats.powerball.pot, general.defaultRecipient)
                                command_stats.powerball.tickets = 0
                                command_stats.powerball.pot = base_winnings
                                
                                //JACKPOT Achievement
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
                        if(moneySpent <= total_money){
                            stats.tracker(message.author.id, 1, parseFloat(amount), stats_list)
                            
                            //Sorry. Try Again Achievement
                            unlock.tracker1(message.author.id, 31, parseInt(amount), message, master, tracker)
                            
                            general.CommandPurchase(message, master, amount * price, general.defaultRecipient)
                            //WINNING CONDITION
                            if(attempt(amount, moneySpent, command_stats, message) == true){
                                message.channel.send(`Congradulations. You won Powerball. It took ${command_stats.powerball.tickets} tickets to win. Your prize is ${command_stats.powerball.pot} gbp`)
                                general.CommandPurchase(message, master, -1 * command_stats.powerball.pot, general.defaultRecipient)
                                command_stats.powerball.tickets = 0
                                command_stats.powerball.pot = base_winnings
                                
                                //JACKPOT Achievement
                                unlock.unlock(message.author.id, 10, message, master)
                            }else{
                                message.channel.send("Sorry. Try again");
                            }
                        }else{
                            message.channel.send(`You need at least ${moneySpent} gbp to buy ${amount} tickets`);
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
                    var title = `List of Commands`
                    var description = fs.readFileSync('./text_files/lottery_commands.txt','utf8');
                    var fields = embed.emptyValue
                    const embedMessage = embed.EmbedCreator(message, title, description, fields)
                    message.channel.send({embeds: [embedMessage]})
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

function attempt(amount, moneySpent, command_stats, message){
    try{
        var tickets = [];
        var max_guesses = 10000
        var remaining_numbers = parseInt(max_guesses) - parseInt(command_stats.powerball.tickets);

        for(var i = 0; i < amount; i++){
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
            command_stats.powerball.pot = parseInt(command_stats.powerball.pot) + (parseInt(moneySpent) * (4/5));
            return true
        }else{
            command_stats.powerball.tickets = parseInt(command_stats.powerball.tickets) + parseInt(amount);
            command_stats.powerball.pot = parseInt(command_stats.powerball.pot) + (parseInt(moneySpent) * (4/5));
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
