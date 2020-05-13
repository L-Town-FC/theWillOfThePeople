module.exports = {
    name: 'lottery',
    description: 'enters you into the lottery for big money',
    execute(message,args,total_money){
        const cheerio = require('cheerio');
        const request = require('request');
        const Discord = require('discord.js');
        const fs = require('fs');

        var command = args[1];
        var amount = args[2];
        var price = 5;

        switch(command){
            case 'buy':
                if(amount <= 0){
                    message.channel.send("Please choose a number of tickets greater than 0")
                }else if(isNaN(amount) == true){
                    purchase(price, message.author.discriminator);
                    attempt(1, message.author.discriminator, price)
                }else if(parseInt(amount) !== parseFloat(amount)){
                    message.channel.send("Please choose a whole number for the amount of tickets");
                }else{
                    purchase(amount*price, message.author.discriminator);
                    attempt(amount, message.author.discriminator, price);
                }
            break;

            case 'stats':
                var lottery_stats = fs.readFileSync('./text_files/lottery_stats.txt','utf8').split(" ");
                var num_of_guesses = lottery_stats[0];
                var total_pot = lottery_stats[1];
                message.channel.send(`The pot is currently at ${total_pot} gbp. ${num_of_guesses} guesses have been made.`)
            break;
            
            case 'help':
                var lottery_commands = fs.readFileSync('./text_files/lottery_commands.txt','utf8');
                const help_embed = new Discord.RichEmbed()
                .addField('List of Commands', lottery_commands);
                message.channel.send(help_embed);
            break;

            default:
                message.channel.send("Use !lottery help for a list of commands");
        }
    }

}

function attempt(amount, player, price){
    const fs = require('fs');
    const Discord = require('discord.js');
    var lottery_stats = fs.readFileSync('./text_files/lottery_stats.txt','utf8').split(" ");
    var tickets = [];
    var remaining_numbers = 50000 - parseInt(lottery_stats[0]);

    for(i = 0; i < amount; i++){
        console.log(i);
        tickets[i] = Math.ceil(Math.random()*remaining_numbers);
        var duplicate = true;
        while(duplicate == true){
            if(find_duplicate_in_array(tickets) == []){
                duplicate = false;
            }else{
                duplicate = false;
                tickets[i] = Math.ceil(Math.random()*remaining_numbers);
                console.log(find_duplicate_in_array(tickets));
                console.log(tickets)
            }
        }
    }

    if(tickets.includes(1) == true){
        message.channel.send(`Congradulations. You won the lottery. It took ${lottery_stats[0]} to win. Your prize is ${lottery_stats[1]}`)
    }else{
        lottery_stats[0] = parseInt(lottery_stats[0]) + parseInt(amount);
        lottery_stats[1] = parseInt(lottery_stats[1]) + (amount * price);
        fs.writeFileSync('./text_files/lottery_stats.txt', lottery_stats);
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
}



function purchase(bet_value, player) {
    const fs = require('fs');
    const Discord = require('discord.js');
    var user_and_currency = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
    var user_money = [];
    var array = [];
    var final_array = [];

    for (i = 0; i < user_and_currency.length; i++) {
        user_money[i] = user_and_currency[i].split(" ");
    }
    //breaks .txt into individual person/money pairs


    for (i = 0; i < user_money.length; i++) {
        array[i] = {discrim: user_money[i][0],
                    name: user_money[i][1],
                    money: user_money[i][2]}
    }
    //turns each pair into an object array

    for (i = 0; i < array.length; i++) {
        if (array[i].discrim === player){
            array[i].money = String(parseFloat(array[i].money) - parseFloat(bet_value));
        }
    }
    //compares the current players name to all other server names to see where to attribute bet to
    

    for (j = 0; j < array.length; j++) {
        final_array[j] = array[j].discrim + " " + array[j].name + " " + array[j].money;
    }
    //converts object array back into normal array that can be easily written into a text file

    fs.writeFileSync('./text_files/currency.txt', final_array);
}