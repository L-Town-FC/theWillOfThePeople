module.exports = {
    name: 'delete',
    description: 'deletes the previous message',
    execute(message,args,total_money){
        const fs = require('fs');
        const Discord = require('discord.js');
        const cost = 1000;
        
        if(typeof(args[1]) == 'undefined'){
            var num = 1;
            var total_cost = cost * num;
            if (total_money >= total_cost){
                purchase(cost, message.author.discriminator);
                message.channel.bulkDelete(parseInt(num) + 1);
                message.channel.send(`${num} message has been deleted`);
            }else{
                message.channel.send(`This command costs ${total_cost} gbp`)
            }
        }else if(parseInt(args[1]) > 0){
            var num = args[1];
            var total_cost = cost * num;
            if (total_money >= total_cost){
                purchase(total_cost, message.author.discriminator);
                message.channel.bulkDelete(parseInt(num) + 1);
                message.channel.send(`${num} message has been deleted`);
            }else{
                message.channel.send(`This command costs ${total_cost} gbp`)
            }
        }else{
            message.channel.send("Use the commmand as the following: \n \n!delete #_of_messages_to_delete \n \nIf no number is specified it is assumed to be one")
        }
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