module.exports = {
    name: 'achievements',
    description: 'shows achievements',
    execute(message,args){
        const fs = require('fs');
        const Discord = require('discord.js');
        var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        var achievements = JSON.parse(fs.readFileSync("./JSON/achievements.json", "utf-8"))
        var user = message.author.id;
        var name = args[1];
        var success = false;
        
        try{
            if(typeof(name) == 'undefined'){
                for(i in master){
                    if(user == i){
                        message.channel.send(`${master[i].name} has ${master[i].gbp} gbp`);
                    }
                }
            }else if(name.toLowerCase() == 'list'){
                var list = []
                var counter = 0
                for(i in achievements){
                    list[counter] = `${i}. ${achievements[i].name}`
                    counter = counter + 1
                }
                const achievements_list = new Discord.RichEmbed()
                .setTitle("List of All Achievements")
                .setDescription(list)
                message.channel.send(achievements_list)
            }else{
                for(i in master){
                    if(master[i].name.toLowerCase() === name.toLowerCase()){
                        message.channel.send(`${master[i].name} has ${master[i].gbp} gbp`);
                        success = true
                    }
                }
                if(success == false){
                    message.channel.send("Please use a valid name")
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in bank.js");
        }   
    }
}