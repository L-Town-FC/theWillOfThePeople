module.exports = {
    name: 'transfer',
    description: 'allows transfer of gbp from one person to another',
    execute(message,args,total_money, master){
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')

        var recipient = args[1];
        var amount = args[2];
        var initiator = message.author.id;
        var names = [];

        try{
            var counter = 0
            for(i in master){
                names[counter] = master[i].name.toLowerCase()
                counter++
            }
            if(message.channel.id == 711634711281401867 || message.channel.id == 702205197740540004){
                message.channel.bulkDelete(1)
                unlock.unlock(initiator, 7, message, master)
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
                give_money(initiator, recipient, amount, message, master);
                message.channel.send(`${master[message.author.id].name} has successfully transferred ${amount} gbp to ${recipient}`);
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in transfer.js");
        }
    }
}

function give_money(initiator, recipient, amount, message, master) {
    try{
        const Discord = require('discord.js');
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')

        for(i in master){
            if(initiator == i){
                for(j in master){
                    if(master[j].name.toLowerCase() == recipient.toLowerCase()){
                        master[j].gbp = parseFloat(master[j].gbp) + parseFloat(amount)
                        master[i].gbp = parseFloat(master[i].gbp) - parseFloat(amount)
                        
                        if(message.channel.type === 'dm'){
                            var users = message.mentions._client.users.array()
                            for(var k in users){
                                //console.log(users[k])
                                if(users[k].id == j){
                                    users[k].send(`You have been transferred ${amount} gbp`)
                                }
                            }
                        }

                        if(message.channel.id == '668600084052705290'){
                            unlock.unlock(j, 16, message, master)
                        }
                    }
                }
            }
        }

    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in Transfer.js Give_Money");
    }
}