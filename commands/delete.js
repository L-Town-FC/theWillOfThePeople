module.exports = {
    name: 'delete',
    description: 'deletes the previous message',
    execute(message,args,total_money, master, tracker){
        const fs = require('fs');
        const unlock = require("./Functions/Achievement_Functions")
        const general = require('./Functions/GeneralFunctions')
        const cost = 1500;
        var deletes = JSON.parse(fs.readFileSync("./JSON/delete_tracker.json", "utf-8"))
        var totalCost = 0

        try{
            if(typeof(args[1]) == 'undefined'){
                var num = 1;
                if(deletes[message.author.id].deletes + num <= 5){
                    totalCost = cost * num;
                    if (total_money >= totalCost){
                        general.CommandPurchase(message, master, cost, general.defaultRecipient)
                        message.channel.bulkDelete(parseInt(num) + 1);
                        message.channel.send(`${num} message has been deleted`);
                        
                        //History is Written By The Victors Achivement
                        unlock.tracker1(message.author.id, 25, num, message, master, tracker)
                        
                        deletes[message.author.id].deletes = deletes[message.author.id].deletes + num
                        fs.writeFileSync ("./JSON/delete_tracker.json", JSON.stringify(deletes, null, 2), function(err) {
                            if (err) throw err;
                            console.log('complete');
                            }
                        );
                    }else{
                        message.channel.send(`This command costs ${totalCost} gbp`)
                    }
                }else{
                    message.channel.send('You can only use this command 5 times per day')
                }
            }else if(parseInt(args[1]) > 0){
                var num = parseInt(args[1]);
                if(deletes[message.author.id].deletes + num <= 5){
                    totalCost = cost * num;
                    if (total_money >= totalCost){
                        general.CommandPurchase(message, master, totalCost, general.defaultRecipient)
                        message.channel.bulkDelete(parseInt(num) + 1);
                        message.channel.send(`${num} message(s) has/have been deleted`);
                        
                        //History is Written by the Victors achievement
                        unlock.tracker1(message.author.id, 25, num, message, master, tracker)
                        
                        deletes[message.author.id].deletes = deletes[message.author.id].deletes + num
                        fs.writeFileSync ("./JSON/delete_tracker.json", JSON.stringify(deletes, null, 2), function(err) {
                            if (err) throw err;
                            console.log('complete');
                            }
                        );
                    }else{
                        message.channel.send(`This command costs ${totalCost} gbp`)
                    }
                }else{
                    message.channel.send('You can only use this command 5 times per day')
                }
            }else{
                message.channel.send("Use the commmand as the following: \n \n!delete #_of_messages_to_delete \n \nIf no number is specified it is assumed to be one")
            }
        }catch(err){
            console.log(err)
            message.channel.send("Can't delete DMs");
        }
    }
}
