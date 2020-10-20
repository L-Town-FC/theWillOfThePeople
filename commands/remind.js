module.exports = {
    name: 'remind',
    description: 'lets you set reminders',
    execute(message, args){
        
        var command = String(args[1]).toLowerCase() || 'none'
        var unit = command[command.length - 1]
        var amount = command.substring(0, command.length - 1)
        if(typeof(reminder_list) == 'undefined'){
            reminder_list = {}
        }

        if(parseInt(amount) == parseInt(amount) && isNaN(amount) == false && amount > 0){
            if(['s','m','h','d'].includes(unit) == true){
                command = 'reminder'
            }else{
                message.channel.send('You must specify units of seconds(s), minutes(m), hours(h), or days(d)')
            }
        }else if(command == 'list' || command == 'help'){

        }else{
            message.channel.send('You must specify an amount great than 0')
        }

        switch(command){
            case 'reminder':
                Reminder(message, amount, unit, reminder_list)
            break;
            case 'list':
                Reminder_List(message, args, reminder_list)
            break;
            case 'help':
                Help(message, args)
            break;
            default:
                message.channel.send('Use "!remind help" for a list of commands')
        }
    }
}

async function Reminder(message, amount, units, reminder_list){
    //creates array with following format
    //[user id, random number, actual reminder]
    //this is added to the global reminder list
    //setTimeout is created using the specified amount and units

}

async function Reminder_List(message, args, reminder_list){

}

function Help(message, args){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')

    var commands = fs.readFileSync('./text_files/remind_commands.txt')
    var help_embed = new Discord.RichEmbed()
    .setTitle('List of Commands:')
    .setDescription(commands)
    .setColor(embed.Color(message))
    .addField('**Disclaimer:**', 'Reminders will disappear when the bot restarts. Use at your own risk')
    message.channel.send(help_embed)

}