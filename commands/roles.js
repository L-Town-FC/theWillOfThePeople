module.exports = {
    name: 'roles',
    description: 'gives list of roles on the server',
    execute(message,args, master){
        const fs = require('fs')
        const unlock = require('./Functions/Achievement_Functions')
        const embed = require('./Functions/embed_functions')
        var roles = JSON.parse(fs.readFileSync("./JSON/roles.json", "utf-8"))
        var names = [];
        var counter = 0

        for(i in master){
            names[counter] = master[i].name
            if(typeof(args[1] !== 'undefined')){
                if(String(args[1]).toLowerCase() === master[i].name.toLowerCase()){
                    var name_index = counter 
                    var person = i
                }
            }
            counter = counter + 1
        }

        if(typeof(args[1]) == 'undefined'){
            try{
                const Discord = require('discord.js');
                const help_embed = new Discord.RichEmbed()
                var roles_list = []
                for(var i in roles){
                    roles_list.push(`${i}. ${roles[i].role} - ${roles[i].person}`)
                }
                help_embed.addField('List of Electable Roles', roles_list)
                .setColor(embed.Color(message))
                message.channel.send(help_embed);
            }catch(err){
                console.log(err)
                message.channel.send("Error occurred in Roles.js");
            }
        }else if(typeof(name_index) !== 'undefined'){
            try{
                if(message.member.roles.find(r => r.name === "Junior Representative Assistant") || message.member.roles.find(r => r.name === "Senior Representative Assistant") || message.member.roles.find(r => r.name === "The People's Representative") || message.member.roles.find(r => r.name === "The People's Leader")){
                    console.log(Object.keys(roles).length)
                    if(parseInt(args[2]) >= 1 && parseInt(args[2]) <= Object.keys(roles).length ){
                        roles[args[2]].person = master[person].name
                        message.channel.send('Roles has been updated')
                        fs.writeFile ("./JSON/roles.json", JSON.stringify(roles, null, 2), function(err) {
                            if (err) throw err;
                            console.log('complete');
                            }
                        );
                    }else{
                        message.channel.send('Please select a role number that exists')
                    }
                }else{
                    message.channel.send('You must be a mod to update the roles')
                }
            }catch(err){
                console.log(err)
                message.channel.send('Error Occurred in Roles.js update')
            }
        }else{
            message.channel.send("Use !roles [names of person] [role number]")
        }
    }

}