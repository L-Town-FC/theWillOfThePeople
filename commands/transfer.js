module.exports = {
    name: 'transfer',
    description: 'allows transfer of gbp from one person to another',
    execute(message,args,total_money){
        const Discord = require('discord.js');
        const fs = require('fs');

        var recipient = args[1];
        var amount = args[2];
        var initiator = message.author.id;
        var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))

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

            if(message.channel.id == 711634711281401867 || message.channel.id == 702205197740540004){
                message.channel.bulkDelete(1)
            }else if(args.length == 1){
                message.channel.send("The format is !transfer [Person you want to transfer to] [amount to transfer]")
            }else if(names.includes(recipient.toLowerCase()) !== true){
                message.channel.send("That recipient doesn't exist");
                message.channel.send("The format is !transfer [Person you want to transfer to] [amount to transfer]")
            }else if(amount <= 0 || isNaN(amount) == true){
                message.channel.send("You must send a valid amount of greater than 0 gbp");
                message.channel.send("The format is !transfer [Person you want to transfer to] [amount to transfer]");
            }else if(parseFloat(amount) > parseFloat(total_money)){
                message.channel.send("You are trying to transfer more gbp than you currently have");
                console.log(amount)
                console.log(total_money)
            }else{
                give_money(initiator, recipient, amount);
                message.channel.send(`You have successfully transferred ${amount} gbp to ${recipient}`);
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in transfer.js");
        }
    }
}

function give_money(initiator, recipient, amount) {
    try{
        const Discord = require('discord.js');
        const fs = require('fs');
        var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))

        for(i in master){
            if(initiator == i){
                for(j in master){
                    if(master[j].name.toLowerCase() == recipient.toLowerCase()){
                        master[j].gbp = parseFloat(master[j].gbp) + parseFloat(amount)
                        master[i].gbp = parseFloat(master[i].gbp) - parseFloat(amount)
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