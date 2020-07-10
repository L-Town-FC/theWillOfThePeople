module.exports = {
    name: 'steal',
    description: 'allows stealing of gbp from one person',
    execute(message,args,total_money, master){
        const unlock = require('./Functions/Achievement_Functions')

        var recipient = args[1];
        var amount = args[2];
        var initiator = message.author.id;
        var stolen_percent = (15 + Math.floor(Math.random() * 10))/100
        var names = [];
        var counter = 0
        var gbp_amounts = 1000

        try{
            
            for(i in master){
                names[counter] = master[i].name.toLowerCase()
                if(master[i].gbp < gbp_amounts){
                    gbp_amounts = master[i].gbp
                    var id = i
                    var poorest = id
                }
                counter++
            }
            counter = 0
            for(i in master){
                names[counter] = master[i].name.toLowerCase()
                if(master[i].gbp > gbp_amounts){
                    gbp_amounts = master[i].gbp
                    var id = i
                    var richest = id
                }
                counter++
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
                steal(initiator, recipient, amount, stolen_percent, message, master, poorest, richest);
                message.channel.send(`You have successfully stolen ${stolen_percent * amount} gbp from ${recipient}`);
                unlock.tracker1(initiator, 36, 1, message, master)
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in transfer.js");
        }
    }
}

function steal(initiator, recipient, amount, stolen_percent, message, master, poorest, richest) {
    try{
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')

        for(i in master){
            if(initiator == i){
                for(j in master){
                    if(master[j].name.toLowerCase() == recipient.toLowerCase()){
                        master[j].gbp = parseFloat(master[j].gbp) - stolen_percent * parseFloat(amount)
                        master[i].gbp = parseFloat(master[i].gbp) - (1 - stolen_percent) * parseFloat(amount)
                        unlock.unlock(i, 12, message, master)
                        unlock.unlock(j, 11, message, master)
                        if(j == poorest){
                            unlock.unlock(initiator, 30, message, master)
                        }
                        if(j == richest){
                            unlock.unlock(initiator, 35, message, master)
                        }
                        unlock.tracker1(initiator, 37, (stolen_percent * parseFloat(amount)), message, master)
                    }
                }
            }
        }

        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Steal.js Give_Money");
    }
}