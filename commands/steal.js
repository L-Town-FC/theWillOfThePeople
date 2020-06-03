module.exports = {
    name: 'steal',
    description: 'allows stealing of gbp from one person',
    execute(message,args,total_money){

        const Discord = require('discord.js');
        const fs = require('fs');

        var recipient = args[1];
        var amount = args[2];
        var initiator = message.author.id;
        var stolen_percent = (15 + Math.floor(Math.random() * 10))/100

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


            if(args.length == 1){
                message.channel.send("The format is !steal [Person you want to steal from] [amout to pay for heist]")
            }else if(names.includes(recipient.toLowerCase()) !== true){
                message.channel.send("That recipient doesn't exist");
                message.channel.send("The format is !steal [Person you want to steal from] [amount to pay for heist]")
            }else if(amount < 250 || isNaN(amount) == true){
                message.channel.send("You must pay a valid amount of greater than 250 gbp");
                message.channel.send("The format is !steal [Person you want to steal from] [amount to pay for heist]");
            }else if(parseFloat(amount) > parseFloat(total_money)){
                message.channel.send("You dont't have enough gbp to cover the heist expenses");
            }else{
                steal(initiator, recipient, amount, stolen_percent);
                message.channel.send(`You have successfully stolen ${stolen_percent * amount} gbp from ${recipient}`);
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in transfer.js");
        }
    }
}

function steal(initiator, recipient, amount, stolen_percent) {
    try{
        const Discord = require('discord.js');
        const fs = require('fs');
        var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))

        for(i in master){
            if(initiator == i){
                for(j in master){
                    if(master[j].name.toLowerCase() == recipient.toLowerCase()){
                        master[j].gbp = parseFloat(master[j].gbp) - stolen_percent * parseFloat(amount)
                        master[i].gbp = parseFloat(master[i].gbp) - (1 - stolen_percent) * parseFloat(amount)
                    }
                }
            }
        }

        fs.writeFileSync ("master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Transfer.js Give_Money");
    }
}