module.exports = {
    name: 'herald',
    description: 'gives you a herald',
    execute(message,args,total_money){

        const Discord = require('discord.js');
        const fs = require('fs');

        var command = args[1];
        var amount = args[2];
        var price = 1000;
        var money_spent = price * parseInt(amount);
        var herald_stats = fs.readFileSync('./text_files/herald_counter.txt','utf8').split(",");
        var min_uses = 2;

        switch(command){
            case 'buy':
                try{
                    if(herald_stats[0] != 0){
                        message.channel.send(`${name(message.author.discriminator)} is already employing the herald. You will have to wait until they run out of uses`)
                    }else if(amount <= 0){
                        message.channel.send('Please choose a whole number greater than 0 for the number of sets');
                    }else if(isNaN(amount) == true){
                        
                        if(price < total_money){
                            purchase(price, message.author.discriminator)
                            fs.writeFileSync('./text_files/herald_counter.txt', `${min_uses},${message.author.discriminator}`)
                            message.channel.send(`You have successfully rented the Herald for ${min_uses} uses`)
                        }else{
                            message.channel.send(`You need at least ${price} gbp for this command`)
                        }
                    }else if(parseInt(amount) !== parseFloat(amount)){
                        message.channel.send("Please choose a whole number greater than 0 for the number of sets");
                    }else{
                        if(money_spent < total_money){
                            purchase(amount*price, message.author.discriminator);
                            fs.writeFileSync('./text_files/herald_counter.txt', `${min_uses*amount},${message.author.discriminator}`)
                            message.channel.send(`You have successfully rented the Herald for ${min_uses*amount} uses`)
                        }else{
                            message.channel.send(`You need at least ${money_spent} gbp to buy ${amount} sets of uses`);
                        }
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in Herald.js Buy");
                }

            break;

            case 'stats':
                try{
                    var remaining_uses = herald_stats[0];
                    if(remaining_uses == 0){
                        message.channel.send("Noone is currently using the herald")
                    }else{
                        message.channel.send(`${name(message.author.discriminator)} is currently using the herald. They have ${remaining_uses} uses remaining`)
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in Herald.js Stats");
                }
            break;
            
            case 'help':
                try{
                    var herald_commands = fs.readFileSync('./text_files/herald_commands.txt','utf8');
                    const help_embed = new Discord.RichEmbed()
                    .addField('List of Commands', herald_commands);
                    message.channel.send(help_embed);
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in Herald.js Help");
                }

            break;

            default:
                message.channel.send("Use !herald help for a list of commands");
        }
    }

}

function purchase(bet_value, player) {
    try{
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
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Herald.js Purchase");
    }
}

function name(player){
    try{
        const fs = require('fs');
        const Discord = require('discord.js');
        var user_and_currency = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
        var user_money = [];
        var array = [];

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
                return array[i].name
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Herald.js Names");
    }
}