invalid = "invalid"
module.exports.invalid = invalid
defaultRecipient = "bot"
module.exports.defaultRecipient = defaultRecipient

function CommandUsageValidator(message, master, transactionAmount, minimumTrasactionPrice, commandUserBankRoll, commandTarget){
    //this command will go through all the necessary check when seeing if a person is able to use a command that uses gbp
    //these commands are blackjack, transfer, guess game, roulette, steal, powerball, insults, boo

    //first they will check if the amount the user gives is a positive interger
    //then is will check if the the amount is above the minimum threshold for the command
    //then it will check is the user has enough gbp
    //if these conditions are are fulfilled the command can proceed to its next step
    if(isNaN(transactionAmount) || Math.sign(transactionAmount) == -1){
        message.channel.send("Value must be a positive number")
        return false
    }

    if(transactionAmount < minimumTrasactionPrice){
        message.channel.send(`You must use at least ${minimumTrasactionPrice} for this command`)
        return false
    }

    if(transactionAmount > commandUserBankRoll){
        message.channel.send("You don't have that much GBP")
        return false
    }

    if(commandTarget == invalid){
        message.channel.send("That person doesn't exist")
        return false
    }

    return true
}

module.exports.CommandUsageValidator = CommandUsageValidator;

function CommandPurchase(message, master, transactionAmount, transactionRecipient){
    if(transactionRecipient != defaultRecipient){
        master[transactionRecipient].gbp += transactionAmount
    }

    master[message.author.id].gbp -= transactionAmount
}

module.exports.CommandPurchase = CommandPurchase;

function NameToUserID(name, master)
{
    
    var recipient_id = invalid

    if(name == "bot"){
        return "bot";
    }

    for(i in master){
        if(master[i].name.toLowerCase() == name){
            var recipient_id = i
        }
    }

    return recipient_id;
}

module.exports.NameToUserID = NameToUserID;
