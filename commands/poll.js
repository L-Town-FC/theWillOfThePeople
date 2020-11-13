module.exports = {
    name: 'poll',
    description: 'lets users run a poll',
    execute(message, args){
        const fs = require('fs')
        var command
        if(typeof(polls) == 'undefined'){
            polls = {}
        }

        var units = String(args[1][args[1].length - 1]).toLowerCase()

        if(['m','h','d'].includes(units) == true){
            if(parseInt(args[1].substring(0, args[1].length - 1)) > 0){
                command = 'create'
            }
        }else if(args[1].toLowerCase() == 'list'){
            command = 'list'
        }else if(args[1].toLowerCase() == 'vote'){
            command = 'vote'
        }

        //!poll 5m Should Zaid stop using Discord? "Yes" "No"
        //!poll vote [poll number] yes/no

        switch(command){
            case 'create':
                Poll_Create(message, args, polls)
            break;
            case 'vote':
                Poll_Vote(message, args, polls)
            break;
            case 'list':
                Poll_List(message, args, polls)
            break;
            default:
                message.channel.send('Use "!poll help" for a list of commands')
        }
    }
}

function Poll_Create(message, args, polls){
    const embed = require('./Functions/embed_functions')
    const Discord = require('discord.js')
    //!poll [time] This is the prompt? Ans 1, Ans 2
    var question_end
    var time = Time_calc(args)
    if(time <= 24 * 3600 * 1000){
        for(var i = 2; i < args.length; i++){
            if(args[i].includes("?")){
                if(typeof(question_end) == 'undefined'){
                    question_end = i    
                }

            }
        }
        var question = ""
        for(var k = 2; k < question_end + 1; k++){
            question += args[k] + " "
        }
        if(typeof(question_end) !== 'undefined'){
            var options = ""
            for(var j = question_end + 1; j < args.length; j++){
                options += args[j] + " "
            }
            var options_list = options.split(",")
            for(var z = 0; z < options_list.length; z++){
                options_list[z] = `${z + 1}. ${options_list[z]}`
            }
        }

        if(options_list.length > 1){
            var used = []
            for(var x in polls){
                used.push(x)
            }
            if(isNaN(x) == true){
                x = 0
            }
            var new_id = parseInt(x) + 1
            polls[new_id] = {
                title: question,
                options: options_list,
                voters: [],
                votes: []
            }
            const poll_embed = new Discord.RichEmbed()
            .setTitle(`${new_id}. ${question}`)
            .setColor(embed.Color(message))
            .setDescription(options_list)
            message.channel.send(poll_embed)

            setTimeout(function(){
                Vote_Count(message, polls)
                delete polls[new_id]
            },time)
        }else{
            message.channel.send("You can't create a poll with only one choice")
        }
    }else{
        message.channel.send('There is a max poll time limit of 1 day')
    }
}

function Poll_Vote(message, args, polls){
    // when you vote it adds this to the poll [id, [choice 1, choice 2, ... choice n]]
    //Tells you your vote has been cast
    //doesn't let you vote again
    //!poll vote [poll number] [choice 1] [choice 2] ...
    if(Object.keys(polls).includes(args[2]) == true){
        var index = args[2]
        if(polls[index].voters.includes(message.author.id) == 1/*false*/){
            var choices = []
            var problems = false
            for(var i = 3; i < args.length; i++){
                if(choices.includes(args[i]) == false){
                    if(isNaN(args[i]) == true){
                        problems = true
                    }else if(args[i] > 0 && args[i] <= polls[index].options.length){
                        choices.push(args[i])
                    }else{
                        problems = true
                    }
                }else{
                    problems = true
                }
            }

            if(problems == false){
                polls[index].voters.push(message.author.id)
                polls[index].votes.push(choices)
            }else{
                message.channel.send('You either tried to put down to many choices, voted the same option more than once, or had invalid choices')
            }
        }else{
            message.channel.send('You already voted in this poll')
        }
    }else{
        message.channel.send(`That poll doesn't exist`)
    }

}

function Poll_List(message, args, polls){
    const embed = require('./Functions/embed_functions')
    const Discord = require('discord.js')

    const poll_list = new Discord.RichEmbed()
    var selection = args[2] || 'none'

    if(Object.keys(polls).includes(selection) == true){
        poll_list.setTitle(polls[selection].title)
        .setDescription(polls[selection].options)
        .setColor(embed.Color(message))
        message.channel.send(poll_list)
    }else if(Object.keys(polls).length > 0){
        poll_list.setTitle('Current Polls')
        var questions = []
        for(var i in polls){
            questions.push(`${i}. ${polls[i].title}`)
        }
        poll_list.setDescription(questions)
        .setColor(embed.Color(message))
        .addField('Additional Info:', 'For additional info on a poll use "!poll list [poll number]"')
        message.channel.send(poll_list)
    }else{
        message.channel.send('There are currently no polls ongoing')
    }
}

function Time_calc(args){
    var amount = args[1].substring(0, args[1].length - 1)
    var units = args[1][args[1].length - 1]
    var multiplier
    switch(units){
        case 'm':
            multiplier = 60
        break;
        case 'd':
            multiplier = 3600 * 24
        break;
        case 'h':
            multiplier = 3600
        break;
    }

    return parseInt(amount) * multiplier * 1000
}

function Vote_Count(message, polls){
    var temp_data = [[1,2,3], [2,3],[2,1],[3],[1,3],[2],[3],[2]]
    var count = [0,0,0]
    for(var i = 0; i < temp_data; i++){

    }
}