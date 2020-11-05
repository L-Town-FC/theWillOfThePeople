module.exports = {
    name: 'transfer',
    description: 'allows transfer of gbp from one person to another',
    execute(message,args,total_money, master){
        try{
            const unlock = require('./Functions/Achievement_Functions')
            var command
            var recipient = args[1].toLowerCase() || 'none';
            var amount = args[2] || 'none';
            if(String(amount).toLowerCase() == 'all'){
                amount = master[message.author.id].gbp
            }
            for(i in master){
                if(master[i].name.toLowerCase() == recipient){
                    var recipient_id = i
                }
            }

            if(message.channel.id == 711634711281401867 || message.channel.id == 702205197740540004){
                command = 'delete'
            }else if(typeof(recipient_id) !== 'undefined'){
                command = 'name'
            }else if(recipient == 'split'){
                    command = 'split'
            }else if(typeof(recipient_id) == 'undefined'){
                command = 'bad_name'
            }
            

            switch(command){
                case 'name':
                    Standard(message, master, args, recipient_id, amount)
                break;
                case 'split':
                    Split(message, master, args, amount)
                break;
                case 'bad_name':
                    message.channel.send(`The recipient doesn't exst`)
                break;
                case 'delete':
                    message.channel.bulkDelete(1)
                    unlock.unlock(message.author.id, 7, message, master)
                break;
                default: 
                    message.channel.send('Use "!transfer help" for a list of commands')
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in transfer.js')
        }
    }
}

function Standard(message, master, args, recipient_id, amount){
    try{
        if(isNaN(amount) == true || amount <= 0){
            message.channel.send('You must choose a valid amount greater than 0')
        }else if(amount > master[message.author.id].gbp){
            message.channel.send(`You can't transfer more gbp than you have`)
        }else{
            master[message.author.id].gbp -= amount
            master[recipient_id].gbp += amount
            message.channel.send(`${master[message.author.id].name} has transferred ${master[recipient_id].name} ${amount} gbp`)
            if(message.channel.type === 'dm'){
                var users = message.mentions._client.users.array()
                for(var k in users){
                    if(users[k].id == recipient_id){
                        users[k].send(`You have been transferred ${amount} gbp`)
                    }
                }
            }

            if(message.channel.id == '668600084052705290'){
                unlock.unlock(recipient_id, 16, message, master)
            }

        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in transfer.js standard')
    }
}

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