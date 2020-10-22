module.exports = {
    name: 'remind',
    description: 'lets you set reminders',
    execute(message, args,reminder_list){
        
        var command = String(args[1]).toLowerCase() || 'none'
        var unit = command[command.length - 1]
        var amount = command.substring(0, command.length - 1)
        
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
                Reminder(message, args, amount, unit, reminder_list)
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

async function Reminder(message, args, amount, units, reminder_list){
    //creates array with following format
    //[user id, actual reminder]
    //this is added to the global reminder list
    //setTimeout is created using the specified amount and units
    const cron = require('cron')
    var reminder = ""
    for(var j = 2; j < args.length; j++){
        reminder = reminder +  " " + args[j] 
    }
    var used = []
    for(var i in reminder_list){
        used.push(i)
    }
    if(isNaN(i) == true){
        i = 0
    }
    var new_units
    var multiplier
    switch(units){
        case 's':
            new_units = 'seconds'
            multiplier = 1
        break;
        case 'm':
            new_units = 'minutes'
            multiplier = 60
        break;
        case 'h':
            new_units = 'hours'
            multiplier = 3600
        break;
        case 'd':
            new_units = 'days'
            multiplier = 3600 * 24
        break;
    }

    if(amount > 1){
        new_units += 's'
    }

    var new_id = parseInt(i) + 1
    reminder_job = new cron.CronJob('* * * * *', function(){
        //'0 * * * * *'
        
    }, null, true)
    reminder_list[new_id] = [message.author.id, reminder]
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