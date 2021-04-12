module.exports = {
    name: 'teams',
    description: 'lets you randomize teams',
    execute(message, args){
        //var temp = ['Colin', 'Wyatt','Andrew','Derek','Ramzi','Ian','Zaid','Jacob']
        try{
            var command = String(args[1]).toLowerCase() || 'none'
            if(typeof(data) == 'undefined'){
                data = []
            }
            if(isNaN(args[1]) == false && parseInt(args[1]) > 0){
                command = 'number'
            }
            switch(command){
                case 'add':
                    Add(message, args, data)
                break;
                case 'people':
                    People(message, args, data)
                break;
                case 'number':
                    Number(message, args, data)
                break;
                case 'clear':
                    Clear(message, data)
                break;
                case 'help':
                    Help(message)
                break;
                default:
                    message.channel.send(`Use "!teams help" for a list of commands`)
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in teams.js')
        }
    }
}

function Add(message, args, list){
    try{
        for(var i = 2; i < args.length; i++){
            list.push(args[i])
        }
        message.channel.send(`List updated`)
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in teams.js Add')
    }
}

function People(message, args, list){
    try{
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        var people_embed = new Discord.MessageEmbed()
        .setTitle('Current People')
        .setDescription(list)
        .setColor(embed.Color(message))
        message.channel.send(people_embed)
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in teams.js People')
    }
}

function Number(message, args, data){
    try{
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')

        var list = []
        for(var i = 0; i < data.length; i++){
            list.push(data[i])
        }
        var num_of_teams = parseInt(args[1])
        var teams = []
        if(num_of_teams > 10){
            message.channel.send('You can only have a maximum number of 10 teams')
        }else{
            for(var i = 0; i < num_of_teams; i++){
                teams[i] = []
            }
            var list_count = data.length
            var counter = 0
            //var team_member
            var team_member_index
            //var list_count = list.length
            for(var i = 0; i < list_count; i++){
                team_member_index = Math.floor(Math.random() * list.length)
                teams[counter].push(list[team_member_index])
                list.splice(team_member_index, 1)
                counter++
                if(counter >= teams.length){
                    counter = 0
                }
            }
            var teams_embed = new Discord.MessageEmbed()
            .setTitle('Teams')
            .setColor(embed.Color(message))
            if(num_of_teams <= list_count && list_count != 0){
                for(var i = 0; i < teams.length; i++){
                    teams_embed.addField(`Team ${i + 1}:`, teams[i])
                }
                message.channel.send(teams_embed)
            }else{
                message.channel.send('Not enough people to make teams')
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in teams.js Number')
    }
}

function Clear(message, data){
    try{
        data.splice(0,data.length)
        message.channel.send('List cleared')
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in teams.js Clear')
    }
}

function Help(message){
    try{
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        const fs = require('fs')

        var help = fs.readFileSync('./text_files/teams_commands.txt')
        var help_embed = new Discord.MessageEmbed()
        .setTitle('List of Commands')
        .setColor(embed.Color(message))
        .setDescription(help)
        message.channel.send(help_embed)
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in teams.js Help')
    }
}