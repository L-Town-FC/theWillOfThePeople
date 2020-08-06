module.exports = {
    name: 'loan',
    description: 'lets you take out loans with people',
    execute(message, args, master){
        const fs = require('fs')
        const Discord = require('discord.js')
        var command = args[1]
        var names = []
        var user = ''
        for(i in master){
            names.push(master[i].name.toLowerCase())
        }
        if(!args[1]){
            command = 'person'
            user = message.author.id
        }else if(names.includes(args[1].toLowerCase()) == true){
            command = 'person'
            for(i in master){
                if(master[i].name.toLowerCase() == args[1].toLowerCase()){
                    user = i
                }
            }
        }

        switch(command){
            case 'person':
                Loan_Checker(message, user, master)
            break;
            case 'offer':
                Loan_Offer(message, args, master)
            break;
            case 'accept':
                Loan_Accept(message, master)
            break;
            case 'pay':
               Loan_Pay(message, args, master)
            break;
            case 'cancel':
                master[message.author.id].loans ={
                    target: "",
                    remaining: 0,
                    collection: 0,
                    rate: 0
                }
            break;
            case 'help':
                Loan_Help(message)
            break
            default:
                message.channel.send('Use "!loan help" for a list of commands')
        }
    }
}

function Loan_Checker(message, user, master){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var targeted = false
    for(var i in master){
        if(master[i].loans.target == user){
            var targeted = [i, master[i].loans.remaining, master[i].loans.collection, master[i].loans.rate]
        }
    }
    //checks if the user is being targeted by anyone

    if(master[user].loans.target !== ""){
        var target = [master[user].loans.target, master[user].loans.remaining, master[user].loans.collection, master[user].loans.rate]
    }else{
        var target = false
    }
    //checks if the user is targeting anyone

    var loan_list = new Discord.RichEmbed()
    .setTitle(`***${master[user].name} Loan list:***`)
    .setColor(embed.Color(message))
    if(target !== false){
        loan_list.addField(`***Debtor***`, [`Loaning to: ${master[target[0]].name}`, `Amount to collect: ${target[1]} gbp`,`Interest Rate: ${target[3]}%`,`Days until collection: ${target[2]}`] )
    }else{
        loan_list.addField('***Debtor***', 'None')
    }
    if(targeted !== false){
        loan_list.addField(`***Creditor***`, [`In Debt to: ${master[targeted[0]].name}`, `Amount to pay: ${targeted[1]} gbp`, `Interest Rate: ${targeted[3]}%`, `Days until payment: ${targeted[2]}`] )
    }else{
        loan_list.addField('***Creditor***', 'None')
    }
    message.channel.send(loan_list)
}

function Loan_Offer(message, args, master){
//!loan offer [person] [amount] [interest] [days]
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var person = args[2] || ""
    var amount = args[3]
    var interest = args[4]
    var days = args[5]
    var names = []
    for(i in master){
        names.push(master[i].name.toLowerCase())
    }
    if(names.includes(person.toLowerCase()) == true){
        var target_check = false
        for(var i in master){
            if(person.toLowerCase() == master[i].name.toLowerCase()){
                var person_id = i
                for(var j in master){
                    if(person_id == master[j].loans.target){
                        target_check = true
                    }
                }
            }
        }
        if(target_check == false){
            if(isNaN(amount) == false && parseFloat(amount) > 0 && parseFloat(amount) <= master[message.author.id].gbp){
                if(isNaN(interest) == false && interest > 0){
                    if(isNaN(days) == false && parseInt(days) == days && days > 0){
                        //This is where the command actually happens
                        //Everything else is just getting to this point
                        var time = 30
                        message.channel.send(`The loan offer will be available for ${time} seconds`)
                        loan_offer = [person.toLowerCase(), parseFloat(amount), parseFloat(interest), parseInt(days), message.author.id]
                        setTimeout(function(){
                            if(typeof(loan_accept) == 'undefined'){
                                message.channel.send("Offer wasn't accetped in time. Please send it again")
                            }else{
                                delete loan_accept
                            }
                            delete loan_offer
                        },time * 1000)
                    }else{
                        message.channel.send('Please give a whole number of days')
                    }
                }else{
                    message.channel.send('Please give a valid interest rate')
                }
            }else{
                if(parseFloat(amount) > master[message.author.id].gbp){
                    message.channel.send("You don't have enough gbp for that loan")
                }else{
                    message.channel.send('Please give a valid amount greater than 0')
                }
            }
        }else{
            message.channel.send(`${master[person_id].name} already has a loan taken out`)
        }
    }else{
        message.channel.send('Please give a valid name')
    }
}

function Loan_Accept(message, master){
    if(typeof(loan_offer) !== 'undefined'){
        var isTarget = false
        for(i in master){
            if(master[i].loans.target == message.author.id){
                isTarget = true
            }
        }
        if(isTarget == false){
            if(master[message.author.id].name.toLowerCase() == loan_offer[0]){
                master[message.author.id].loans = {
                    target: loan_offer[4],
                    remaining: parseFloat(loan_offer[1]) * (1 + parseFloat(loan_offer[2])/100),
                    collection: loan_offer[3],
                    rate: loan_offer[2]
                }
                loan_accept = true
                message.channel.send('Loan was accepted')
            }else{
                message.channel.send("You don't have a loan offer")
            }
        }else{
            message.channel.send('You already have loan taken out')
        }
    }else{
        message.channel.send('There is no loan offer available')
    }
}

function Loan_Pay(message, args, master){
    //!loan pay [number]
    var target = false
    var amount = parseFloat(args[2]) || 0
    for(i in master){
        if(master[i].loans.target == message.author.id){
            target = true
            var creditor_id = i
        }
    }
    if(target == true){
        if(isNaN(amount) == false && parseFloat(amount) > 0){
            if(amount <= master[message.author.id].gbp){
                if(master[message.author.id].loans.remaining >= amount){
                    if(amount < master[message.author.id].loans.remaining){
                        message.channel.send(`You payed ${amount} gbp off your loan`)
                    }
                    master[creditor_id].loans.remaining = master[creditor_id].loans.remaining - amount
                    master[message.author.id].gbp = master[message.author.id].gbp - amount
                    master[creditor_id].gbp = master[creditor_id].gbp + amount
                }else{
                    master[creditor_id].gbp = master[creditor_id].loans.remaining + master[creditor_id].gbp
                    master[message.author.id].gbp = master[message.author.id].gbp - master[creditor_id].loans.remaining
                    master[creditor_id].loans.remaining = 0
                    message.channel.send('You payed more back than you owed. The difference was refunded to you')
                }
                
                if(master[creditor_id].loans.remaining == 0){
                    master[creditor_id].loans = {
                        target: "",
                        remaining: 0,
                        collection: 0,
                        rate: 0
                    }
                    message.channel.send('You have payed off your loan')
                }
            }else{
                message.channel.send(`You can't pay back more than you have`)
            }
        }else{
            message.channel.send('Give an amount of greater than 0 gbp')
        }
    }else{
        message.channel.send(`You currently don't have a loan to pay back`)
    }
}

function Loan_Help(message){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var loan_help = fs.readFileSync('./text_files/loan_commands')
    var loan_embed = new Discord.RichEmbed()
    .setTitle('List of Commands')
    .setColor(embed.Color(message))
    .setDescription(loan_help)

    message.channel.send(loan_embed)
}