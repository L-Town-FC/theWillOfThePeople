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
                    People(message, data)
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

function People(message, list){
    try{
        const embed = require('./Functions/embed_functions')
        var title = 'Current People'
        var description
        if(list < 1){
            description = "None"
        }else{
            description = list
        }

        var fields = embed.emptyValue

        const embedMessage = embed.EmbedCreator(message, title, description, fields)
        message.channel.send({ embeds: [embedMessage] });
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in teams.js People')
    }
}

function Number(message, args, data){
    try{
        const embed = require('./Functions/embed_functions')

        var list = []
        for(var i = 0; i < data.length; i++){
            list.push(data[i])
        }
        var numOfTeams = parseInt(args[1])
        var teams = []
        if(numOfTeams > 10){
            message.channel.send('You can only have a maximum number of 10 teams')
            return
        }

        for(var i = 0; i < numOfTeams; i++){
            teams[i] = []
        }
        var listCount = data.length
        var counter = 0
        //var team_member
        var team_member_index
        //var listCount = list.length
        for(var i = 0; i < listCount; i++){
            team_member_index = Math.floor(Math.random() * list.length)
            teams[counter].push(list[team_member_index])
            list.splice(team_member_index, 1)
            counter++
            if(counter >= teams.length){
                counter = 0
            }
        }
        
        if(listCount == 0){
            message.channel.send("The team list is empty")
            return
            }
            
        if(numOfTeams > listCount){
            message.channel.send('Not enough people to make teams')
            return
        }
                
        var fields = []
        var fieldsCounter = 0
        for(var i = 0; i < teams.length; i++){
            fields[fieldsCounter] = {name: `Team ${i + 1}}:`, value: teams[i]}
            fieldsCounter++
        }

        var title = 'Teams'
        var description = embed.emptyValue

        const embedMessage = embed.EmbedCreator(message, title, description, fields)
        message.channel.send({ embeds: [embedMessage] });
        
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
        const embed = require('./Functions/embed_functions')
        const fs = require('fs')

        var title = 'List of Commands'
        var description = fs.readFileSync('./text_files/teams_commands.txt', 'utf-8')
        var fields = embed.emptyValue

        const embedMessage = embed.EmbedCreator(message, title, description, fields)
        message.channel.send({ embeds: [embedMessage] });
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in teams.js Help')
    }
}