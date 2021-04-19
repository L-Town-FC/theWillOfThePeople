module.exports = {
    name: 'herald',
    description: 'gives you a herald',
    execute(message,args,total_money, master){

        const Discord = require('discord.js');
        const fs = require('fs');
        const embed = require('./Functions/embed_functions')

        var command = args[1];
        var amount = args[2];
        var price = 500;
        var money_spent = price * parseInt(amount);
        var herald_stats = fs.readFileSync('./text_files/herald/herald_counter.txt','utf8').split(",");
        var min_uses = 1;
        var counter_discrim = fs.readFileSync('./text_files/herald/herald_counter.txt','utf8').split(",");
        var description = message.cleanContent.split("!herald say");

        switch(command){
            case 'buy':
                try{
                    if(herald_stats[0] != 0){
                        message.channel.send(`${name(herald_stats[1], master)} is already employing the herald. You will have to wait until they run out of uses`)
                    }else if(amount <= 0){
                        message.channel.send('Please choose a whole number greater than 0 for the number of sets');
                    }else if(isNaN(amount) == true){
                        if(price < total_money){
                            purchase(price, message.author.id, master)
                            fs.writeFileSync('./text_files/herald/herald_counter.txt', `${min_uses},${message.author.id}`)
                            message.channel.send(`You have successfully rented the Herald for ${min_uses} uses`)
                        }else{
                            message.channel.send(`You need at least ${price} gbp for this command`)
                        }
                    }else if(parseInt(amount) !== parseFloat(amount)){
                        message.channel.send("Please choose a whole number greater than 0 for the number of sets");
                    }else{
                        if(money_spent < total_money){
                            purchase(amount*price, message.author.id, master);
                            fs.writeFileSync('./text_files/herald/herald_counter.txt', `${min_uses*amount},${message.author.id}`)
                            message.channel.send(`You have successfully rented the Herald for ${min_uses*amount} uses`)
                        }else{
                            message.channel.send(`You need at least ${money_spent} gbp to buy ${amount} sets of uses`);
                        }
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in Herald.js Buy");
                }

            break;

            case 'stats':
                try{
                    var remaining_uses = herald_stats[0];
                    if(remaining_uses == 0){
                        message.channel.send("Noone is currently using the herald")
                    }else{
                        message.channel.send(`${name(message.author.id, master)} is currently using the herald. They have ${remaining_uses} uses remaining`)
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in Herald.js Stats");
                }
            break;

            case 'say':
                if(message.author.id == herald_stats[1]){
                    if(message.attachments.array().length == 0){                
                        message.channel.bulkDelete(1);
                        const message_embed = new Discord.MessageEmbed()
                        .setTitle(`Important Decree from His Excellency ${name(message.author.id, master)}`)
                        .setDescription(description)
                        .setAuthor("-----------------------------------------------------------",message.author.displayAvatarURL)
                        .setFooter("By the Suprme Leader's grace. May he help us live our most fulfilled lives")
                        .setColor(embed.Color(message))
                        message.channel.send(` @everyone Hear ye, hear ye. Would'st thou all gather round for a message that our beloved ${name(message.author.id, master)} hath decided you should know and is as follows:`)
                        message.channel.send(message_embed);
                        counter_discrim[0] = parseInt(counter_discrim[0]) - 1
                        if (counter_discrim[0] == 0){
                            fs.writeFileSync('./text_files/herald/herald_counter.txt', "0,0")
                        }else{
                            fs.writeFileSync('./text_files/herald/herald_counter.txt', counter_discrim)
                        }
                    }else{
                        message.channel.send("You can't have any attachments when you use the herald")
                    }
                }else{
                    message.channel.send("You aren't employing the herald")
                }
            break;
            
            case 'help':
                try{
                    var herald_commands = fs.readFileSync('./text_files/herald_commands.txt','utf8');
                    const help_embed = new Discord.MessageEmbed()
                    .addField('List of Commands', herald_commands)
                    .setColor(embed.Color(message))
                    message.channel.send(help_embed);
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in Herald.js Help");
                }

            break;

            default:
                message.channel.send("Use !herald help for a list of commands");
        }
    }

}

function purchase(bet_value, player, master) {
    try{
        master[player].gbp = parseFloat(master[player].gbp) - parseFloat(bet_value)
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in Herald.js Purchase");
    }
}

function name(player, master){
    try{

    return master[player].name

    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in Herald.js Names");
    }
}