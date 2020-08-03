const { log } = require('console')

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
                loan_accept = master[message.author.id].name
            break;
            case 'pay':
               
            break;
            case 'cancel':

            break;
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
        if(isNaN(amount) == false && parseFloat(amount) > 0 && parseFloat(amount) <= master[message.author.id].gbp){
            if(isNaN(interest) == false && interest > 0){
                if(isNaN(days) == false && parseInt(days) == days && days > 0){
                    //This is where the command actually happens
                    //Everything else is just getting to this point
                    var time = 5
                    message.channel.send(`The loan offer will be available for ${time} seconds`)
                    loan_offer = [person.toLowerCase(), parseFloat(amount), parseFloat(interest), parseInt(days)]
                    setTimeout(function(){
                        if(typeof(loan_accept) == 'undefined'){
                            message.channel.send("Offer wasn't accetped in time. Please send it again")
                        }else{
                            console.log(loan_accept)
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
        message.channel.send('Please give a valid name')
    }
}
