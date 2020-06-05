module.exports = {
    name: 'roles',
    description: 'gives list of roles on the server',
    execute(message,args){
        const fs = require('fs')
        var roles = fs.readFileSync('./text_files/roles.txt','utf8');
        var split_roles = roles.split(",")
        var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))
        var names = [];
        var counter = 0

        for(i in master){
            names[counter] = master[i].name
            if(typeof(args[1] !== 'undefined')){
                if(String(args[1]).toLowerCase() === master[i].name.toLowerCase()){
                    var name_index = counter 
                }
            }
            counter = counter + 1
        }

        if(typeof(args[1]) == 'undefined'){
            try{
                const Discord = require('discord.js');
                const help_embed = new Discord.RichEmbed()
                .addField('List of Electable Roles', split_roles);
                message.channel.send(help_embed);
            }catch(err){
                console.log(err)
                message.channel.send("Error Occured in Roles.js");
            }
        }else if(typeof(name_index) !== 'undefined'){
            if(message.author.id == '434471986748456962'){
                if([1,2,3,4,5].includes(parseInt(args[2])) == true){
                    switch(parseInt(args[2])){
                        case 1:
                            split_roles[parseInt(args[2] - 1)] = `1. The People's Representative - ${names[name_index]}`
                        break;
                        case 2:
                            split_roles[parseInt(args[2] - 1)] = `2. Senior Representative Assistant - ${names[name_index]}`
                        break;
                        case 3:
                            split_roles[parseInt(args[2] - 1)] = `3. Junior Representative Assistant - ${names[name_index]}`
                        break;
                        case 4:
                            split_roles[parseInt(args[2] - 1)] = `4. Dog Catcher - ${names[name_index]}`
                        break;
                        case 5:
                            split_roles[parseInt(args[2] - 1)] = `5. Soup Maker - ${names[name_index]}`
                        break;
                    }
                    fs.writeFileSync("./text_files/roles.txt", split_roles)
                    message.channel.send("Role Updated")
                }else{
                    message.channel.send("Choose a valid role number")
                }
            }else{
                message.channel.send("Only the Supreme Leader may change roles")
            }
        }else{
            message.channel.send("Use !roles [names of person] [role number]")
        }
    }

}