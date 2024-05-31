module.exports = {
    name: 'transfer',
    description: 'allows transfer of gbp from one person to another',
    execute(message, args, master){
        try{
            const unlock = require('./Functions/Achievement_Functions')
            const general = require('./Functions/GeneralFunctions')
            var amount = args[2] || 'none';
            if(String(amount).toLowerCase() == 'all'){
                amount = parseFloat(master[message.author.id].gbp)
            }else{
                amount = parseFloat(amount)
            }
            
            //checks if command is sent empty and then adds helpful text in response
            if(args.length < 2){
                message.channel.send("You must specify a person and an amount. ex !transfer [person] [amount]")
                return;
            }

            //takes given target and gets their id from their name
            var recipient = args[1].toLowerCase();
            var targetID = general.NameToUserID(args[1].toLowerCase(), master)

            //achivement for using the command in the bot tinkering channel
            if(message.channel.id == 711634711281401867 || message.channel.id == 702205197740540004){
                message.channel.bulkDelete(1)

                //Your a Dumbass Achievement
                unlock.unlock(message.author.id, 7, message, master)
                return
            }

            //checks if user is trying to run split function of command
            if(recipient == 'split'){
                Split(message, master, args, amount)
                return;
            }

            //sends helpful message if person asks for help
            if(recipient == "help"){
                message.channel.send("!transfer [person] [amount] for basic")
                message.channel.send("!transfer split [amount] [person 1] [person 2] ... to split an amount amongst multiple people")
                return
            }

            //checks basic parameters for if a command can be used
            if(!general.CommandUsageValidator(message, master, amount, 0, master[message.author.id].gbp, targetID)){
                return
            }

            //executes payment and confirmation of command
            general.CommandPurchase(message, master, amount, targetID)
            message.channel.send(`${master[message.author.id].name} has transferred ${master[targetID].name} ${amount} gbp`)
            
            //checks command is run in their dms for achievement
            if(message.channel.type === 'dm'){
                var users = message.mentions._client.users.array()
                for(var k in users){
                    if(users[k].id == recipient_id){
                        users[k].send(`You have been transferred ${amount} gbp`)
                    }
                }
            }
            //Stack your family channel id
            if(message.channel.id == '668600084052705290'){
                //Easy Money Achievement
                unlock.unlock(recipient_id, 16, message, master)
            }

        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in transfer.js')
        }
    }
}

//lets you split an amount between multiple people
function Split(message, master, args, amount){
    try{
        //!transfer split all Wyatt Ian
        if(isNaN(amount) == true || amount <= 0){
            message.channel.send('You must choose a valid amount greater than 0')
        }else if(amount > master[message.author.id].gbp){
            message.channel.send(`You can't transfer more gbp than you have`)
        }else{
            var list = []
            for(var i = 3; i < args.length; i++){
                for(var j in master){
                    if(master[j].name.toLowerCase() == args[i].toLowerCase()){
                        list.push(j)
                    }
                }
            }
            if(list.length > 0){
                var split_amount = (amount / list.length).toFixed(2)
                master[message.author.id].gbp -= parseFloat(amount)
                var transfer_message = `${master[message.author.id].name} has transferred ${split_amount} gbp to: \n`
                for(var k = 0; k < list.length; k++){
                    master[list[k]].gbp += parseFloat(split_amount)
                    transfer_message += `${master[list[k]].name} \n`
                }
                message.channel.send(transfer_message)
            }else{
                message.channel.send(`You didn't choose any existing recipients`)
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in transfer.js split')
    }
}