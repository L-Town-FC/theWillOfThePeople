module.exports = {
    name: 'boo',
    description: 'lets you boo people',
    execute(message,args, master, tracker, command_stats){
        const general = require('./Functions/GeneralFunctions')
        var boo = command_stats.boo
        var price = 500;

        if(args.length < 2){
            args[1] = "none"
        }

        var targetID = general.NameToUserID(args[1].toLowerCase() || "none")

        try{
            
            if(targetID == general.invalid){
                message.channel.send(`${master[boo].name} is currently being booed`)
                return
            }

            if(!general.CommandUsageValidator(message, master, price, price, master[message.author.id].gbp, targetID)){
                return
            }

            command_stats.boo = targetID
            general.CommandPurchase(message, master, price, general.defaultRecipient)
            AchievementChecker(message, master, tracker, targetID)

        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in Boo.js")
        }
    }
}


function AchievementChecker(message, master, tracker, targetID){
    //Professional Asshole Achievement Tracker
    unlock.tracker1(message.author.id, 13, 1, message, master, tracker)

    //Toxic Achievement Tracker
    unlock.reset2(targetID, 20, 0, tracker, message)
    unlock.tracker2(targetID, 20, 0, message, master, tracker)

    var success = true
    message.channel.send(`${master[targetID].name} is now being booed`)
    if(message.author.id == targetID){
        //Masochist Achievement
        unlock.unlock(message.author.id, 22, message, master)
    }
}