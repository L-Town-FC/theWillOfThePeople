module.exports = {
    name: 'bank',
    description: 'says currency amount',
    execute(message,args){
        const fs = require('fs');
        var groups = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
        var array = [];
        var discrim_name_money = [];
        var user = message.author.discriminator;
        var names = [];
        var given_name = String(args[1]).toLowerCase();
        
        try{
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
                    if (array[i].discrim === user){
                        message.channel.send(`${array[i].name} has ${array[i].money} gbp`);
                    }
                }
            }else if (names.includes(given_name) === true){
                for (i = 0; i < array.length; i++) {
                    if (String(given_name).toLowerCase() == String(array[i].name).toLowerCase()){
                        message.channel.send(`${array[i].name} has ${array[i].money} gbp`);
                    }
                }
            }else{
                message.channel.send('Please Use a Valid Name');
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in bank.js");
        }   
    }
}