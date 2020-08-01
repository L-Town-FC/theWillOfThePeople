module.exports = {
    name: 'bank',
    description: 'says currency amount',
    execute(message,args, master){
        const Discord = require('discord.js');
        const fs = require('fs')
        const unlock = require("./Functions/Achievement_Functions")
        const embed = require('./Functions/embed_functions')
        const max_amount = 20000
        var name = args[1];
        var command = args[1]
        var names = []
        for(i in master){
            names.push(master[i].name.toLowerCase())
        }
        if(!command){
            command = 'name'
            var person = message.author.id
        }else if(names.includes(command) == true){
            command = 'name'
            for(i in master){
                if(master[i].name.toLowerCase() == name.toLowerCase()){
                    var person = i
                }
            }
        }
        try{
            switch(command){
                case 'all':
                    try{
                        var everyone = [];
                        var counter = 0
                        var total = 0
                        for(i in master){
                            everyone[counter] = `${master[i].name}: ${master[i].gbp}`;
                            counter = counter + 1;
                            total = total + master[i].gbp
                        }
                        const message_embed = new Discord.RichEmbed()
                        .setTitle("List of all Public accounts on Server")
                        .setDescription(everyone)
                        .addField(`Total Public GBP on Server`, total)
                        .setColor(embed.Color(message))
                        message.channel.send(message_embed)
                    }catch(err){
                        console.log(err)
                        message.channel.send('Error occurred in bank.js all')
                    }
                break;
                case 'name':
                    try{
                        message.channel.send(`${master[person].name} has ${master[person].gbp} gbp`);
                    }catch(err){
                        console.log(err)
                        message.channel.send('Error occurred in bank.js name')
                    }
                break;
                case 'account':
                    try{
                        message.channel.send(`You currently have ${master[message.author.id].account} gbp in your private account`)
                    }catch(err){
                        console.log(err)
                        message.channel.send('Error occurred in bank.js account')
                    }
                break;
                case 'deposit':
                    try{
                        var account = master[message.author.id].account
                        var amount = parseFloat(args[2])
                        if(isNaN(amount) == true || amount <= 0){
                            message.channel.send('Please specify an amount greater than 0')
                        }else if(amount > master[message.author.id].gbp){
                            message.channel.send(`You can't deposit more gbp than you currently have`)
                        }else if(account == max_amount){
                            message.channel.send(`You are at the max account size of ${max_amount} gbp`)
                        }else if(account + amount > max_amount){
                            message.channel.send(`Depositing the full amount would put you over the limit. Instead you deposited up to the limit of ${max_amount} gbp`)
                            var deposited = max_amount - account
                            master[message.author.id].account = max_amount
                            master[message.author.id].gbp = master[message.author.id].gbp - deposited
                        }else{
                            message.channel.send(`You deposited ${amount} gbp` )
                            master[message.author.id].account = master[message.author.id].account + amount
                            master[message.author.id].gbp = master[message.author.id].gbp - amount
                        }
                    }catch(err){
                        console.log(err)
                        message.channel.send('Error occurred in bank.js deposit')
                    }
                break;
                case 'withdraw':
                    try{
                        var account = master[message.author.id].account
                        var amount = parseFloat(args[2])
                        if(isNaN(amount) == true || amount <= 0){
                            message.channel.send('Please specify an amount greater than 0')
                        }else if(amount > master[message.author.id].account){
                            message.channel.send(`You can't withdraw more gbp than you currently have in your account`)
                        }else{
                            message.channel.send(`You withdrew ${amount} gbp` )
                            master[message.author.id].account = master[message.author.id].account - amount
                            master[message.author.id].gbp = master[message.author.id].gbp + amount
                        }
                    }catch(err){
                        console.log(err)
                        message.channel.send('Error occurred in bank.js withdraw')
                    }
                break;
                case 'help':
                    try{
                        var help = fs.readFileSync('text_files/bank_commands.txt', 'utf-8')
                        const help_list = new Discord.RichEmbed()
                        .setTitle("List of Commands")
                        .setDescription(help)
                        .setColor(embed.Color(message))
                        message.channel.send(help_list)
                    }catch(err){
                        console.log(err)
                        message.channel.send("Error occured in bank.js help")
                    }
                break;
                default:
                    message.channel.send('Use "!bank help" for a list of commands')
            }

        }catch(err){
            console.log(err)
            message.channel.send('Error Occured in bank.js')
        }
        /*
        try{
            if(message.channel.id == 711634711281401867 || message.channel.id == 702205197740540004){
                message.channel.bulkDelete(1)
                unlock.unlock(user, 7, message, master)
            }else if(typeof(name) == 'undefined'){
                for(i in master){
                    if(user == i){
                        message.channel.send(`${master[i].name} has ${master[i].gbp} gbp`);
                    }
                }
            }else if(name.toLowerCase() == 'all'){
                var everyone = [];
                var counter = 0
                var total = 0
                for(i in master){
                    everyone[counter] = `${master[i].name}: ${master[i].gbp}`;
                    counter = counter + 1;
                    total = total + master[i].gbp
                }
                const message_embed = new Discord.RichEmbed()
                .setTitle("List of all Public accounts on Server")
                .setDescription(everyone)
                .addField(`Total Public GBP on Server`, total)
                .setColor(embed.Color(message))
                message.channel.send(message_embed)
            }else{
                for(i in master){
                    if(master[i].name.toLowerCase() === name.toLowerCase()){
                        message.channel.send(`${master[i].name} has ${master[i].gbp} gbp`);
                        success = true
                    }
                }
                if(success == false){
                    message.channel.send("Please use a valid name")
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in bank.js");
        }   
        */
    }
}