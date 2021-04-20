module.exports = {
    name: 'poll',
    description: 'lets users run a poll',
    execute(message, args){
        try{
            const fs = require('fs')
            var command
            if(typeof(polls) == 'undefined'){
                polls = {}
            }
            if(typeof(args[1]) != 'undefined'){
                var units = String(args[1][args[1].length - 1]).toLowerCase()
            }else{
                args.push('none')
            }

            if(['m','h','d'].includes(units) == true){
                if(parseInt(args[1].substring(0, args[1].length - 1)) > 0){
                    command = 'create'
                }
            }else if(args[1].toLowerCase() == 'list'){
                command = 'list'
            }else if(args[1].toLowerCase() == 'vote'){
                command = 'vote'
            }else if(args[1].toLowerCase() == 'help'){
                command = 'help'
            }else{
                command = 'none'
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
                case 'help':
                    Poll_Help(message)
                break;
                default:
                    message.channel.send('Use "!poll help" for a list of commands')
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in poll.js')
        }
    }
}

function Poll_Create(message, args, polls){
    try{
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
                    Vote_Count(message, polls, new_id)
                    delete polls[new_id]
                },time)
            }else{
                message.channel.send("You can't create a poll with only one choice")
            }
        }else{
            message.channel.send('There is a max poll time limit of 1 day')
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in poll.js create')
    }
}

function Poll_Vote(message, args, polls){
    // when you vote it adds this to the poll [id, [choice 1, choice 2, ... choice n]]
    //Tells you your vote has been cast
    //doesn't let you vote again
    //!poll vote [poll number] [choice 1] [choice 2] ...
    try{
        if(Object.keys(polls).includes(args[2]) == true){
            var index = args[2]
            if(polls[index].voters.includes(message.author.id) != true){
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
                    message.channel.send('Your vote was successful')
                }else{
                    message.channel.send('You either tried to put down to many choices, voted the same option more than once, or had invalid choices')
                }
            }else{
                message.channel.send('You already voted in this poll')
            }
        }else if(args[2].toLowerCase() == 'help'){
            message.channel.send('Voting Format is: !poll vote [poll number] [choice 1] [choice 2]...')
        }else{
            message.channel.send(`That poll doesn't exist`)
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in poll.js vote')
    }
}

function Poll_List(message, args, polls){
    try{
        const embed = require('./Functions/embed_functions')
        const Discord = require('discord.js')

        const poll_list = new Discord.RichEmbed()
        var selection = args[2] || 'none'

        if(Object.keys(polls).includes(selection) == true){
            poll_list.setTitle(polls[selection].title)
            .setColor(embed.Color(message))

            var tally_list = []
            var current_tally = []

            for(var i = 0; i < polls[selection].options.length; i++){
                tally_list[i] = [i+1,0]
            }
            for(var i = 0; i < polls[selection].votes.length; i++){
                tally_list[polls[selection].votes[i][0] - 1][1] += 1
            }
            for(var i = 0; i < tally_list.length; i++){
                current_tally.push(polls[selection].options[i] + `: ${tally_list[i][1]}`)
            }
            poll_list.setDescription(current_tally)
            
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
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in poll.js list')
    }
}

function Time_calc(args){
    try{
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
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in poll.js time_calc')
    }
}

function Vote_Count(message, polls, poll_index){
    try{
        //var temp_data = [[1,2,3,4],[2,3,4],[4,2],[2,3,1],[4,2,1],[3,2,4],[1,2,4],[4,2,3],[1,2],[4,2],[4,1],[2,1],[3,2,1],[4,3,1],[2,4,1],[1,4,3]]
        //var count = [[1,0],[2,0],[3,0],[4,0]]
        var temp_data = polls[poll_index].votes
        var count = []
        for(var i = 0; i < polls[poll_index].options.length; i++){
            count[i] = [i+1,0]
        }
        var run_off = true
        var removed_choice
        var removed_index = 0
        var already_voted = false
        var run_off_counter = 1
        
        
        while (run_off == true){
            for(var i = 0; i < temp_data.length; i++){
                for(var j = 0; j < temp_data[i].length;j++){
                    if(already_voted == false){
                        count[temp_data[i][0] - 1][1] += 1  
                        already_voted = true
                    }  
                }
                already_voted = false
            }

            var winner = 0 //0 = none, 1 = winner>50%, 2 = winner = 50% (need to check for tie)
            var winning_choice = -1
            for(var i = 0; i < count.length; i++){
                if(count[i][1]/temp_data.length > 0.5){
                    var winner = 1
                    winning_choice = i
                }else if(count[i][1]/temp_data.length == 0.5){
                    var winner = 2
                    if(winning_choice !== -1){
                        winning_choice = 99
                    }else{
                        winning_choice = i
                    }
                }
            }
            if(winner == 1){
                //message.channel.send(`${count[winning_choice][0]} was the winner`)
                Results(message, count, polls[poll_index], 'none', count[winning_choice][0])
                run_off = false
            }else if(winner == 2){
                if(winning_choice == 99){
                    //message.channel.send(`There is a tie`)
                    Results(message, count, polls[poll_index], 'none', 'tie')
                    run_off = false
                }else{
                    Results(message, count, polls[poll_index], 'none', count[winning_choice][0])
                    run_off = false
                }
            }else{
                //run off
                Results(message, count, polls[poll_index], run_off_counter, 'runoff')
                run_off_counter++
                var sorted_array = count.sort(function(a,b){return a[1] - b[1]})
                removed_choice = sorted_array[removed_index][0]
                removed_index++
                for(var i = temp_data.length - 1; i > -1; i--){
                    for(var j = temp_data[i].length - 1; j > -1; j--){
                        if(temp_data[i][j] == removed_choice){
                            temp_data[i].splice(j,1)
                        }
                    }
                    if(temp_data[i] == '[]'){
                        temp_data.splice(i,1)
                    }
                }
                for(var i = 0; i < count.length; i++){
                    count[i] = [i + 1,0]
                }
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in poll.js vote count')
    }
}

function Results(message, count, poll, number, winner){
    try{
        const embed = require('./Functions/embed_functions')
        const Discord = require('discord.js')
        var results_field = []

        var results = new Discord.RichEmbed()
        .setColor(embed.Color(message))
        .setTitle(`**${poll.title}**`)
        /*
        if(isNaN(number) == false){
            results.setDescription(`Results require a runoff`)
        }else{
            results.setDescription(`Final Results`)
        }
        */
        for(var i = 0; i < count.length;i++){
            results_field.push(`${poll.options[i].substring(3)}: ${count[i][1]}`)
        }
        results.addField('**Results:**', results_field, true)
        if(String(winner).toLowerCase() == 'tie'){
            results.addField('**Outcome:**', 'Tie')
        }else if(String(winner).toLowerCase() == 'runoff'){
            results.addField('**Outcome:**', `Run off needed`)
        }else{
            results.addField('**Outcome:**', `Winner: ${poll.options[winner - 1].substring(2)}`)
        }
        message.channel.send(results)
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in poll.js results')
    }
}

function Poll_Help(message){
    try{
        const embed = require('./Functions/embed_functions')
        const Discord = require('discord.js')
        const fs = require('fs')
        var command_list = fs.readFileSync('./text_files/poll_commands.txt')

        var help_embed = new Discord.RichEmbed()
        .setTitle('List of Poll Commands')
        .setColor(embed.Color(message))
        .setDescription(command_list)
        message.channel.send(help_embed)
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in poll.js help')
    }
}