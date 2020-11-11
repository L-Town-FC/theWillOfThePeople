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
        }else if(args[1] == 'list'){
            command = 'list'
        }

        //!poll 5m Should Zaid stop using Discord? "Yes" "No"
        //!poll vote [poll number] yes/no

        switch(command){
            case 'create':
                Poll_Create(message, args, polls)
            break;
            case 'vote':
                
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
    //!poll [time] This is the prompt? "Ans1" "Ans2"
    var question_end
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
        const poll_embed = new Discord.RichEmbed()
        .setTitle(`${question}`)
        .setColor(embed.Color(message))
        .setDescription(options_list)
        message.channel.send(poll_embed)

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
            votes: []
        }
        console.log(polls)
    }else{
        message.channel.send("You can't create a poll with only one choice")
    }


}

function Poll_Vote(message, args, polls){
    // when you vote it adds this to the poll [id, [choice 1, choice 2, ... choice n]]
    //Tells you your vote has been cast
    //doesn't let you vote again

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