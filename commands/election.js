module.exports = {
    name: 'election',
    description: 'lets you vote in elections',
    execute(message, args, master){
        const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
        const election_roles = [`1: The People's Representative`, `2: Senior Representative Assistant`, `3: Junior Representative Assistant`, `4: Dog Catcher`, `5: Soup Maker`]
        var command = String(args[1]).toLowerCase() || 'None'
        //console.log(command < election_roles.length)
        if(parseInt(command) > 0 && parseInt(command) <= election_roles.length){
            command = 'number'
        }
        //sample messages
        //!election basics
        //election roles
        //election [role number] [candidate 1] [candidate 2] ...
        
        switch(command){
            case 'number':
                Vote(message, args, master, reactions, election_roles)
            break;
            case 'roles':
                Roles(message, election_roles)
            break;
            case 'help':
                Help(message)
            break;
            default:
                message.channel.send(`Use "!election help" for a list of commands`)
        }
    }
}

function Vote(message, args, master, reactions, election_roles){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    if(args.length == 2){
        message.channel.send('You must choose candidates')
    }else if(args.length > 7){
        message.channel.send('You must choose at most 5 candidates')
    }else{
        var poll = new Discord.RichEmbed()
        var list = []
        var time = 20
        for(var k = 2; k < args.length; k++){
            list.push(`${reactions[k -2]}. ${args[k]}`)
        }
        poll.setTitle(`${election_roles[parseInt(args[1]) - 1].split(":")[1]} Poll`)
        .setDescription(list)
        .setColor(embed.Color(message))
        .addField('How to Vote:','Select the emoji corresponding to the name you want to vote for')
        message.channel.send(poll).then(message => {
            for(var j = 0; j < args.length - 2; j++){
                message.react(reactions[j])
            }
            setTimeout(function(){
                var emojis = message.reactions.array()
                //console.log(args)
                var list2 = [0,0,0,0,0]
                for(var i in emojis){
                    switch(emojis[i]._emoji.name){
                        case '1️⃣':
                            //message.channel.send(`${emojis[i].count} for 1`)
                            list2[0] = emojis[i].count - 1
                        break;
                        case '2️⃣':
                            //message.channel.send(`${emojis[i].count} for 2`)
                            list2[1] = emojis[i].count -1
                        break;
                        case '3️⃣':
                            //message.channel.send(`${emojis[i].count} for 3`)
                            list2[2] = emojis[i].count - 1
                        break;
                        case '4️⃣':
                            //message.channel.send(`${emojis[i].count} for 4`)
                            list2[3] = emojis[i].count - 1
                        break;
                        case '5️⃣':
                            //message.channel.send(`${emojis[i].count} for 5`)
                            list2[4] = emojis[i].count - 1
                        break;
                    }
                }
                //console.log(list2)
                var final_list = []
                for(var h = 2; h < args.length; h++){
                    final_list.push(`${args[h]}: ${list2[h - 2]}`)
                }
                var results = new Discord.RichEmbed()
                .setTitle(`${election_roles[parseInt(args[1]) - 1].split(":")[1]} Poll Results`)
                .setDescription(final_list)
                .setColor(embed.Color(message))
                var counter = 0
                var max = -1
                var index = 0
                for(var k = 0; k < list2.length; k++){
                    if(list2[k] > max){
                        max = list2[k]
                        index = k
                        counter = 0
                    }else if(list2[k] == max){
                        counter++
                    }
                }
                if(counter > 0){
                    results.addField(`Winner:`, `Tie`)
                }else{
                    results.addField(`Winner: `, args[index + 2])
                }
                message.channel.send(results)

                //console.log(message.reactions.array()[0]._emoji)
            },time * 1000)
        })
    }
}

function Roles(message, election_roles){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')

    var roles_embed = new Discord.RichEmbed()
    .setTitle('Election Basics')
    .setDescription(election_roles)
    .setColor(embed.Color(message))
    message.channel.send(roles_embed)
}
function Help(message){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var commands = fs.readFileSync('./text_files/election_help.txt', 'utf-8')

    var help_embed = new Discord.RichEmbed()
    .setTitle('Election Basics')
    .setDescription(commands)
    .setColor(embed.Color(message))
    message.channel.send(help_embed)
}