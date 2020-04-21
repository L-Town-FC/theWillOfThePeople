module.exports = {
    name: 'more_money',
    description: 'gives 1 gbp every message',
    execute(message){
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
            if (array[i].discrim == message.author.discriminator){
                array[i].money = parseFloat(array[i].money) + 1;
            }
        }

        for (j = 0; j < array.length; j++) {
            final_array[j] = array[j].discrim + " " + array[j].name + " " + array[j].money;
        }
        //converts object array back into normal array that can be easily written into a text file
    
        fs.writeFileSync('./text_files/currency.txt', final_array);
    }

}