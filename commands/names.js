module.exports = {
    name: 'names',
    description: 'lists all names on the server',
    execute(message,args){
        const fs = require('fs');
        const Discord = require('discord.js');
        var user_and_currency = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
        var user_money = [];
        var array = [];
        var just_names = [];

        try{
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
                just_names[i] = array[i].name;
            }

            const message_embed = new Discord.RichEmbed()
                .setTitle("List of all names on Server")
                .setDescription(just_names)
            message.channel.send(message_embed)
        }catch(err){
            console.log(err)
                    message.channel.send("Error Occured in Names.js");
        }
    }
}
