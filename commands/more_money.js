module.exports = {
    name: 'more_money',
    description: 'gives 1 gbp every message',
    execute(message, master, stats_list, tracker){
        
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        const stats = require('./Functions/stats_functions')
        try{
            //var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
            var person = message.author.id
            var backup = JSON.parse(fs.readFileSync("./JSON/backup.json", "utf-8"))
            var gbp_farmed = JSON.parse(fs.readFileSync("./JSON/gbp_farmer.json", "utf-8"))
            
        }catch(err){
            try{
                message.channel.send("Error occured in master.json. File reset")
                var backup = JSON.parse(fs.readFileSync("./JSON/backup.json", "utf-8"))
                fs.writeFile ("./JSON/master.json", JSON.stringify(backup), function(err) {
                    if (err) throw err;
                    console.log('complete');
                    }
                );
            }catch(err){
                console.log(err)
            }
        }

        try{
            for(i in master){
                if(master[i].gbp == null){
                    master[i].gbp = 0;
                }
            }
        
            if(message.author.discriminator !== '9509' && message.author.discriminator !== '0250'){
                if(message.content.startsWith("!") == false){
                    if(message.channel.type !== 'dm'){
                        if(message.member.roles.find(r => r.name === "Junior Representative Assistant") || message.member.roles.find(r => r.name === "Senior Representative Assistant") || message.member.roles.find(r => r.name === "The People's Representative") ||message.member.roles.find(r => r.name === "Dogcatcher") || message.member.roles.find(r => r.name === "Soupmaker")){
                            unlock.unlock(message.author.id, 24, message, master)
                        }
                    }
                    for(i in master){
                        if(person == i){
                            if(['590585423202484227','712755269863473252', '672846614410428416'].includes(message.channel.id) == true){
                                stats.tracker(person, 9, 1, stats_list)
                            }else{
                                stats.tracker(person, 10, 1, stats_list)
                            }

                            var scaling_modifier = -0.1 * master[person].gbp + 175

                            Achievement_Switch(person, message.channel.id, message, master)
                            Random_Achievements(person, message, master)
                            var amount = 1
                            if(gbp_farmed[person].farmed > 1000){
                                //checks if user has sent 1000 messages today
                                //makes it so if they have they get gbp at a reduced rate
                                var chance = Math.random() * 100
                                if(chance <= 25){
                                    master[person].gbp = Math.round((parseFloat(master[person].gbp) + amount) * 100)/100
                                }

                            }else if(master[person].gbp <= 0){
                                var amount = 5
                                unlock.unlock(person, 3, message, master)
                                master[person].gbp = Math.round((parseFloat(master[person].gbp) + amount) * 100)/100
                            }else if(master[person].gbp < 500){
                                var amount = 2
                                master[person].gbp = Math.round((parseFloat(master[person].gbp) + amount) * 100)/100
                            }else if(master[person].gbp < 750){
                               
                                master[person].gbp = Math.round((parseFloat(master[person].gbp) + amount) * 100)/100
                            }else if(master[person].gbp < 1500){
                                
                                var chance = Math.random() * 100
                                if(chance <= scaling_modifier){
                                    master[person].gbp = Math.round((parseFloat(master[person].gbp) + amount) * 100)/100
                                }
                            }else{
                                
                                var chance = Math.random() * 100
                                if(chance <= 25){
                                    master[person].gbp = Math.round((parseFloat(master[person].gbp) + amount) * 100)/100
                                }
                            }

                            gbp_farmed[person].farmed = gbp_farmed[person].farmed + 1
                            fs.writeFileSync ("./JSON/gbp_farmer.json", JSON.stringify(gbp_farmed, null, 2), function(err) {
                                if (err) throw err;
                                console.log('complete');
                                }
                            );
                        }
                    }
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in More_money.js");
        }
        
    }

}

function Achievement_Switch(user, channel, message, master){
    const unlock = require('./Functions/Achievement_Functions')

    switch(channel){
        case '590583268961812500':
            //politics
            unlock.tracker1(user, 17, 1, message, master, tracker)
        break;
        case '590583073595457547':
            //gaming
            unlock.tracker1(user, 28, 1, message, master, tracker)
        break;
        case '590585423202484227':
            //pugilism
            unlock.tracker1(user, 9, 1, message, master, tracker)
        break;
        case '712755269863473252':
            //blackjack
            unlock.tracker1(user, 9, 1, message, master, tracker)
        break;
        case '590583125445181469':
            //anime
            unlock.tracker1(user, 29, 1, message, master, tracker)
        break;
        case '664241953973731328':
            //feet 664241953973731328
            unlock.tracker1(user, 27, 1, message, master, tracker)
            unlock.tracker2(user, 15, 0, message, master, tracker)
        break;
        case '606515956826636288':
            //dobans 606515956826636288
            unlock.tracker1(user, 26, 1, message, master, tracker)
            unlock.tracker2(user, 15, 1, message, master, tracker)
        break;
    }
}

function Random_Achievements(user, message, master){
    const unlock = require('./Functions/Achievement_Functions')
    if(master[user].gbp <= -250){
        unlock.unlock(user, 34, message, master)
    }else if(master[user].gbp == 69){
        unlock.unlock(user, 41, message, master)
    }else if(master[user].gbp >= 10000){
        unlock.unlock(user, 6, message, master)
    }
    if(message.content.toLowerCase().includes('twitch.tv/') == true){
        unlock.unlock(user, 43, message, master)
    }
}