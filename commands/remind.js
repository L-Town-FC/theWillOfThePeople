module.exports = {
    name: 'remind',
    description: 'lets you set reminders',
    execute(message, args,reminder_list, bot, master){
        
        var command = String(args[1]).toLowerCase() || 'none'
        var unit = command[command.length - 1]
        var amount = command.substring(0, command.length - 1)
        var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

        //!remind 24m Hello
        //!remind october 10 5 Hello
        
        if(parseInt(amount) == parseInt(amount) && isNaN(amount) == false && amount > 0){
            if(['s','m','h','d'].includes(unit) == true){
                if(typeof(args[2]) !== 'undefined'){
                    command = 'reminder'
                }else{
                    message.channel.send('You must specify a reminder message')
                }
            }else{
                message.channel.send('You must specify units of seconds(s), minutes(m), hours(h), or days(d)')
            }
        }else if(command == 'list' || command == 'help'){
            //nothing
        }else if(months.includes(command) == true){
            command = 'months'
        }

        switch(command){
            case 'reminder':
                Reminder(message, args, amount, unit, reminder_list, bot)
            break;
            case 'months':
                Months(message, args, reminder_list)
            break;
            case 'list':
                Reminder_List(message, args, reminder_list, master)
            break;
            case 'help':
                Help(message, args)
            break;
            default:
                message.channel.send('Use "!remind help" for a list of commands')
        }
    }
}

async function Reminder(message, args, amount, units, reminder_list, bot){
    //creates array with following format
    //[user id, actual reminder]
    //this is added to the global reminder list
    //setTimeout is created using the specified amount and units
    if(typeof(args[2]) !== 'undefined'){
        const fs = require('fs')
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
        var time = multiplier * amount
        console.log(time)
        if(amount > 1){
            new_units += 's'
        }

        var new_id = parseInt(i) + 1
        if(time <= 259200){
            reminder_list[new_id] = [message.author.id, reminder, message.channel.id, []]
            message.channel.send('Reminder Set')
            fs.writeFileSync ("./JSON/reminders.json", JSON.stringify(reminder_list, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );

            setTimeout(() => {
                var channel = bot.channels.find(channel => channel.id === message.channel.id)
                channel.send(`<@${message.author.id}> Reminder: \n${reminder}`)
                for(var j in reminder_list){
                    if(reminder_list[j][0] == message.author.id){
                        if(reminder_list[j][1] == reminder){
                            delete reminder_list[j]
                        }
                    }
                }
                fs.writeFileSync ("./JSON/reminders.json", JSON.stringify(reminder_list, null, 2), function(err) {
                    if (err) throw err;
                    console.log('complete');
                    }
                );
            }, 1000 * time)
        }else{
            message.channel.send('The max time on short term reminders is 3 days')
        }
    }else{
        message.channel.send(`You can't set an empty reminder`)
    }
}

async function Reminder_List(message, args, reminder_list, master){
    const embed = require('./Functions/embed_functions')
    const Discord = require('discord.js')

    var user_reminders = []
    var counter = 1
    for(var i in reminder_list){
        if(reminder_list[i][0] == message.author.id){
            var reminder_date = []
            if(reminder_list[i][3].length > 0){
                reminder_date = `, ${reminder_list[i][3][0]}/${reminder_list[i][3][1]}/${reminder_list[i][3][2]} ${reminder_list[i][3][3]}:00`
            }
            user_reminders.push(`${counter}. ${reminder_list[i][1]} ${reminder_date}`)
            counter++
        }
    }
    var reminder_embed = new Discord.RichEmbed()
    .setTitle(`${master[message.author.id].name} Reminder List`)
    .setColor(embed.Color(message))
    .setDescription(user_reminders)
    message.channel.send(reminder_embed)
}

async function Months(message, args, reminder_list){
    const fs = require('fs')
    var day = args[2] || 'none'
    var year = args[3] || 'none'
    var time = args[4] || 'none'
    var date_stuff = []
    var success = false
    //!remind oct 24 7 2020 Hello
    
    if(parseInt(day) == parseFloat(day) && isNaN(day) == false){
        //checks if day is a whole number
        if(parseInt(time) == parseFloat(time) && isNaN(time) == false && time >= 0 && time < 24){
            //checks if time is a whole number
            if(parseInt(year) == parseFloat(year) && isNaN(year) == false && parseInt(year) >= 2020){
                if(typeof(args[5]) !== undefined){
                    //splits months into 3 categories depending on number of days
                    //if the given date falls outside the possible range a negative response is given
                    if(['jan','mar','may','july','aug','oct','dec'].includes(args[1]) == true){
                        if(day > 0 && day <= 31){
                            date_stuff = [args[1], day, year, time]
                            success = true
                        }else{
                            message.channel.send('The date you selected is not valid')
                        }
                    }else if(args[1] == 'feb'){
                        if(day > 0 && day <= 28){
                            date_stuff = [args[1], day, year, time]
                            success = true
                        }else{
                            message.channel.send('The date you selected is not valid')
                        }
                    }else{
                        if(day > 0 && day <= 30){
                            date_stuff = [args[1], day, year, time]
                            success = true
                        }else{
                            message.channel.send('The date you selected is not valid')
                        }
                    }
                }else{
                    message.channel.send(`YOu can't send an empty message`)
                }
            }else{
                message.channel.send('You must give a proper year greater than 2019')
            }
        }else{
            message.channel.send('You must specify a whole number time between 0 and 23 (24 Hr time is used)')
        }
    }else{
        message.channel.send('You must specify a whole number day')
    }

    if(success == true){
        var reminder = ""
        for(var j = 5; j < args.length; j++){
            reminder = reminder + args[j] + " "
        }
        var used = []
        for(var i in reminder_list){
            used.push(i)
        }
        if(isNaN(i) == true){
            i = 0
        }
        var new_id = parseInt(i) + 1
        reminder_list[new_id] = [message.author.id, reminder, message.channel.id, date_stuff]
        message.channel.send('Reminder Set')
        fs.writeFileSync ("./JSON/reminders.json", JSON.stringify(reminder_list, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }
}

function Help(message, args){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')

    var commands = fs.readFileSync('./text_files/remind_commands.txt')
    var help_embed = new Discord.RichEmbed()
    .setTitle('List of Commands:')
    .setDescription('!remind list: Lists your current reminders')// \n\n**Two Ways to Set Reminders**')
    .addField('**Short Term: 3 Days max**', `!remind XY [reminder]: X = amount, Y = units (s,m,h,d)
    -ex. "!remind 24h Make fun of Derek" would set a 24 hour reminder to make fun of Derek`)
    .addField('**Long Term:**', `!remind [month] [day] [year] [hour] [reminder]: 
    -Month = first 3 letters of the month: (october -> oct)
    -military time: (0 -> 12am, 13 -> 1pm)
    -can only set the hour
    
    -ex. "!remind oct 10 2020 14 Derek" would set a reminder "Derek" to go off on 10/10/2020 at 2pm`)
    .setColor(embed.Color(message))
    .addField('**Disclaimer:**', 'Short Term Reminders will disappear when the bot restarts. Use at your own risk')
    message.channel.send(help_embed)

}