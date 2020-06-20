module.exports = {
    name: 'lottery',
    description: 'enters you into the lottery for big money',
    execute(message,args,total_money){
        const Discord = require('discord.js');
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        const stats = require('./Functions/stats_functions')
        var command = args[1];
        var amount = args[2];
        var price = 5;
        var money_spent = price * parseInt(amount);
        var lottery_stats = fs.readFileSync('./text_files/lottery_stats.txt','utf8').split(",");
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))

        switch(command){
            case 'buy':
                try{
                    if(amount <= 0){
                        message.channel.send("Please choose a number of tickets greater than 0")
                    }else if(isNaN(amount) == true){
                        
                        if(price < total_money){
                            purchase(price, message.author.id, master);
                            stats.tracker(message.author.id, 1, 1)
                            if(attempt(1, price) == true){
                                message.channel.send(`Congradulations. You won the lottery. It took ${lottery_stats[0]} tries to win. Your prize is ${lottery_stats[1]}`)
                                purchase(-1 * lottery_stats[1], message.author.id, master);
                                fs.writeFileSync('./text_files/lottery_stats.txt', "0,10000");
                                unlock.unlock(message.author.id, 10, message, master)
                            }else{
                                message.channel.send("Sorry. Better luck next time");
                            }
                        }else{
                            message.channel.send(`You need at least ${price} gbp for this command`)
                        }

                    }else if(parseInt(amount) !== parseFloat(amount)){
                        message.channel.send("Please choose a whole number for the amount of tickets");
                    }else{
                        if(money_spent < total_money){
                            stats.tracker(message.author.id, 1, parseFloat(amount))
                            purchase(amount*price, message.author.id, master);
                            if(attempt(amount, money_spent) == true){
                                message.channel.send(`Congradulations. You won the lottery. It took ${lottery_stats[0]} tries to win. Your prize is ${lottery_stats[1]} gbp`)
                                purchase(-1 * lottery_stats[1], message.author.id, master);
                                fs.writeFileSync('./text_files/lottery_stats.txt', "0,10000");
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
                    message.channel.send("Error Occured in Lottery.js Buy");
                }
            break;

            case 'stats':
                try{
                    var num_of_guesses = lottery_stats[0];
                    var total_pot = lottery_stats[1];
                    message.channel.send(`The pot is currently at ${total_pot} gbp. ${num_of_guesses} guesses have been made.`)
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in Lottery.js Stats");
                }
            break;
            
            case 'help':
                try{
                    var lottery_commands = fs.readFileSync('./text_files/lottery_commands.txt','utf8');
                    const help_embed = new Discord.RichEmbed()
                    .addField('List of Commands', lottery_commands);
                    message.channel.send(help_embed);
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in Lottery.js Help");
                }
            break;

            default:
                message.channel.send("Use !lottery help for a list of commands");
        }
    }

}

function attempt(amount, money_spent){
    try{
        const fs = require('fs');
        const Discord = require('discord.js');
        var lottery_stats = fs.readFileSync('./text_files/lottery_stats.txt','utf8').split(",");
        var tickets = [];
        var max_guesses = 10000
        var remaining_numbers = parseInt(max_guesses) - parseInt(lottery_stats[0]);

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
            lottery_stats[0] = parseInt(lottery_stats[0]) + parseInt(amount);
            lottery_stats[1] = parseInt(lottery_stats[1]) + (parseInt(money_spent) * (4/5));
            fs.writeFileSync('./text_files/lottery_stats.txt', lottery_stats);
            return true
        }else{
            lottery_stats[0] = parseInt(lottery_stats[0]) + parseInt(amount);
            lottery_stats[1] = parseInt(lottery_stats[1]) + (parseInt(money_spent) * (4/5));
            fs.writeFileSync('./text_files/lottery_stats.txt', lottery_stats);
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
        message.channel.send("Error Occured in Lottery.js Attempt");
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