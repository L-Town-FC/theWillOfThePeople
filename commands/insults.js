module.exports = {
    name: 'insults',
    description: 'shows who is being insulted and lets you change who it is',
    execute(message,args,money){
        const fs = require('fs');
        const Discord = require('discord.js');
        var insultee_and_count = fs.readFileSync('./text_files/insult_counter.txt','utf8').split(" ");
        var groups = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
        var array = [];
        var discrim_name_money = [];
        var names = [];
        var price = 100;


        for (i = 0; i < groups.length; i++) {
            discrim_name_money[i] = groups[i].split(" ");
        }
        for (i = 0; i < discrim_name_money.length; i++) {
            array[i] = {discrim: discrim_name_money[i][0],
                        name: discrim_name_money[i][1],
                        money: discrim_name_money[i][2]}
        }
        for (i = 0; i < array.length; i++) {
            names[i] = String(array[i].name).toLowerCase();
        }

        if (typeof(args[1]) == 'undefined' ){
            for (i = 0; i < array.length; i++) {
                if(array[i].discrim == insultee_and_count[0]){
                    message.channel.send(`${array[i].name} is currently being insulted`);
                }
            }
        }else if (names.includes(args[1].toLowerCase()) === true){
            if (money < parseFloat(price)){
                message.channel.send(`You must have atleast ${price} gbp to use this command`);
            }else{
                for (i = 0; i < array.length; i++) {
                    if (String(args[1]).toLowerCase() == String(array[i].name).toLowerCase()){
                        insultee_and_count[0] = array[i].discrim;                
                        fs.writeFileSync('./text_files/insult_counter.txt', insultee_and_count[0] + " " + 0);
                        message.channel.send(`${array[i].name} is now being insulted`);
                        purchase(price,message.author.discriminator);
                    }
                }  
            }
        }else{
            message.channel.send('Please Use a Valid Name');
        }

    }
}

function purchase(bet_value, player) {
    const fs = require('fs');
    var holdings = fs.readFileSync('./text_files/currency.txt','utf8');
    var user_and_currency = holdings.split(",");
    var user_money = [];
    var just_discrim = [];
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
        just_discrim[i] = array[i].discrim;
    }
    //assigns just the names in the object array to another array that can be used to cross reference the current players name
    
    for (i = 0; i < array.length; i++) {
        if (just_discrim[i] === player){
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