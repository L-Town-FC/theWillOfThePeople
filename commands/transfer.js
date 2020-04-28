module.exports = {
    name: 'transfer',
    description: 'allows transfer of gbp from one person to another',
    execute(message,args,total_money){
        const cheerio = require('cheerio');
        const request = require('request');
        const Discord = require('discord.js');
        const fs = require('fs');

        var recipient = args[1];
        var amount = args[2];
        var initiator = message.author.discriminator;

        var full_list = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
        var full_list_split = [];
        var names = [];

        for (i = 0; i < full_list.length; i++){
            full_list_split[i] = full_list[i].split(" ");
        }

        for (i = 0; i < full_list_split.length; i++){
            names[i] = full_list_split[i][1];
        }

        if(names.includes(recipient) !== true){
            message.channel.send("That recipient doesn't exist");
        }else if(parseInt(amount) >! 0){
            message.channel.send("You must send a valid amount of greater than 0");
        }

        give_money(initiator, recipient, amount);

        
    }

}

function give_money(initiator, recipient, amount) {
    const cheerio = require('cheerio');
    const request = require('request');
    const Discord = require('discord.js');
    const fs = require('fs');
    var final_array = [];
    var user_money = [];
    var array = [];
    var holdings = fs.readFileSync('./text_files/currency.txt','utf8');
    var user_and_currency = holdings.split(",");
    for (i = 0; i < user_and_currency.length; i++) {
        user_money[i] = user_and_currency[i].split(" ");
    }
    //breaks .txt into individual person/money pairs

    for (i = 0; i < user_money.length; i++) {
        array[i] = {discrim: user_money[i][0],
                    name: user_money[i][1],
                    money: user_money[i][2]}
    }

    for (i = 0; i < array.length; i++){
        if (array[i].name.toLowerCase() === String(recipient).toLowerCase()){
            array[i].money = parseInt(array[i].money) + parseInt(amount);
            for (i = 0; i< array.length; i++){
                if (array[i].discrim == initiator){
                    array[i].money = parseInt(array[i].money) - parseInt(amount);
                }
            }
        }
    }

    for (j = 0; j < array.length; j++) {
        final_array[j] = array[j].discrim + " " + array[j].name + " " + array[j].money;
    }
    //converts object array back into normal array that can be easily written into a text file

    fs.writeFileSync('./text_files/currency.txt', final_array);


}