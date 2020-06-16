const { unlock } = require('./Functions/Achievement_Functions');

module.exports = {
    name: 'more_money',
    description: 'gives 1 gbp every message',
    execute(message){
        
        const fs = require('fs');
        const unlock = require('./Functions/Achievement_Functions')
        try{
            var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
            var person = message.author.id
            var backup = JSON.parse(fs.readFileSync("./JSON/backup.json", "utf-8"))
            
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
                    fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
                        if (err) throw err;
                        console.log('complete');
                        }
                    );
                }
            }
        
            if(message.author.discriminator !== '9509' && message.author.discriminator !== '0250'){
                if(message.content.startsWith("!") == false){
                    if(message.member.roles.find(r => r.name === "Junior Representative Assistant") || message.member.roles.find(r => r.name === "Senior Representative Assistant") || message.member.roles.find(r => r.name === "The People's Representative") ||message.member.roles.find(r => r.name === "Dogcatcher") || message.member.roles.find(r => r.name === "Soupmaker")){
                        unlock.unlock(message.author.id, 24, message, master)
                    }
                    for(i in master){
                        if(person == i){
                            Achievement_Switch(person, message.channel.id, message, master)
                            if(master[i].gbp <= 0){
                                unlock.unlock(i, 3, message, master)
                                master[i].gbp = Math.round((parseFloat(master[i].gbp) + 5) * 100)/100
                            }else if(master[i].gbp < 250){
                                master[i].gbp = Math.round((parseFloat(master[i].gbp) + 3) * 100)/100
                            }else if(master[i].gbp < 500){
                                master[i].gbp = Math.round((parseFloat(master[i].gbp) + 2) * 100)/100
                            }else if(master[i].gbp < 750){
                                master[i].gbp = Math.round((parseFloat(master[i].gbp) + 1) * 100)/100
                            }else if(master[i].gbp < 1000){
                                master[i].gbp = Math.round((parseFloat(master[i].gbp) + 0.5) * 100)/100
                            }else{
                                master[i].gbp = Math.round((parseFloat(master[i].gbp) + 0.25) * 100)/100
                            }
                            if(master[i].gbp > 10000){
                                unlock.unlock(i, 6, message, master)
                            }
                        }
                    }
                    fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), function(err) {
                        if (err) throw err;
                        console.log('complete');
                        }
                    );
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in More_money.js");
        }
        
    }

}

function Achievement_Switch(user, channel, message, master){
    const fs = require('fs')
    const unlock = require('./Functions/Achievement_Functions')

    switch(channel){
        case '590583268961812500':
            //politics
            unlock.tracker1(user, 17, 1, 100, message, master)
        break;
        case '590583073595457547':
            //gaming
            unlock.tracker1(user, 28, 1, 100, message, master)
        break;
        case '590585423202484227':
            //pugilism
            unlock.tracker1(user, 9, 1, 250, message, master)
        break;
        case '712755269863473252':
            //blackjack
            unlock.tracker1(user, 9, 1, 250, message, master)
        break;
        case '590583125445181469':
            //anime
            unlock.tracker1(user, 29, 1, 100, message, master)
        break;
        case '664241953973731328':
            //feet 664241953973731328
            unlock.tracker1(user, 27, 1, 100, message, master)
            unlock.tracker2(user, 15, 0, message, master)
        break;
        case '606515956826636288':
            //dobans 606515956826636288
            unlock.tracker1(user, 26, 1, 100, message, master)
            unlock.tracker2(user, 15, 1, message, master)
        break;
    }
}