module.exports = {
    name: 'take',
    description: 'lets me take gbp',
    execute(message,args){
        const Discord = require('discord.js');
        const fs = require('fs');

        var recipient = args[1];
        var amount = args[2];

        var full_list = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
        var full_list_split = [];
        var names = [];

        try{
            for (i = 0; i < full_list.length; i++){
                full_list_split[i] = full_list[i].split(" ");
            }

            for (i = 0; i < full_list_split.length; i++){
                names[i] = full_list_split[i][1].toLowerCase();
            }
            
            if(message.author.discriminator == '5198'){
                give_money(recipient, amount);
            }else{

            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in transfer.js");
        }
    }
}

function give_money(recipient, amount) {
    try{
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
                array[i].money = parseFloat(array[i].money) - parseFloat(amount)
            }
        }

        for (j = 0; j < array.length; j++) {
            final_array[j] = array[j].discrim + " " + array[j].name + " " + array[j].money;
        }
        //converts object array back into normal array that can be easily written into a text file

        fs.writeFileSync('./text_files/currency.txt', final_array);
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Transfer.js Give_Money");
    }
}
