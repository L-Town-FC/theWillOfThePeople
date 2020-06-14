module.exports = {
    name: 'delete',
    description: 'deletes the previous message',
    execute(message,args,total_money){
        const fs = require('fs');
        const cost = 1000;

        try{
            if(typeof(args[1]) == 'undefined'){
                var num = 1;
                var total_cost = cost * num;
                if (total_money >= total_cost){
                    purchase(cost, message.author.id, message);
                    message.channel.bulkDelete(parseInt(num) + 1);
                    message.channel.send(`${num} message has been deleted`);
                }else{
                    message.channel.send(`This command costs ${total_cost} gbp`)
                }
            }else if(parseInt(args[1]) > 0){
                var num = args[1];
                var total_cost = cost * num;
                if (total_money >= total_cost){
                    purchase(total_cost, message.author.id, message);
                    message.channel.bulkDelete(parseInt(num) + 1);
                    message.channel.send(`${num} messages has been deleted`);
                }else{
                    message.channel.send(`This command costs ${total_cost} gbp`)
                }
            }else{
                message.channel.send("Use the commmand as the following: \n \n!delete #_of_messages_to_delete \n \nIf no number is specified it is assumed to be one")
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in delete.js");
        }
    }
}

function purchase(bet_value, player, message) {
    try{
        const fs = require('fs');
        var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))

        for(i in master){
            if(player == i){
                master[i].gbp = parseFloat(master[i].gbp) - parseFloat(bet_value)
            }
        }

        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );

    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in delete.js");
    }
}