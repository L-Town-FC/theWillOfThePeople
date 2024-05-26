module.exports = {
    name: 'delete',
    description: 'deletes the previous message',
    execute(message,args,total_money, master, tracker){
        const fs = require('fs');
        const unlock = require("./Functions/Achievement_Functions")
        const cost = 1500;
        var deletes = JSON.parse(fs.readFileSync("./JSON/delete_tracker.json", "utf-8"))

        try{
            if(typeof(args[1]) == 'undefined'){
                var num = 1;
                if(deletes[message.author.id].deletes + num <= 5){
                    var total_cost = cost * num;
                    if (total_money >= total_cost){
                        purchase(cost, message.author.id, message, master);
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
                        message.channel.send(`This command costs ${total_cost} gbp`)
                    }
                }else{
                    message.channel.send('You can only use this command 5 times per day')
                }
            }else if(parseInt(args[1]) > 0){
                var num = parseInt(args[1]);
                if(deletes[message.author.id].deletes + num <= 5){
                    var total_cost = cost * num;
                    if (total_money >= total_cost){
                        purchase(total_cost, message.author.id, message, master);
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
                        message.channel.send(`This command costs ${total_cost} gbp`)
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

function purchase(bet_value, player, message, master) {
    try{
     
    master[player].gbp = parseFloat(master[player].gbp) - parseFloat(bet_value)    

    }catch(err){
        console.log(err)
        message.channel.send("Error Occurred in delete.js");
    }
}