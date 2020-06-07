module.exports = {
    name: 'more_money',
    description: 'gives 1 gbp every message',
    execute(message){
        
        const fs = require('fs');
        try{
            var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))
            var person = message.author.id
            var backup = JSON.parse(fs.readFileSync("backup.json", "utf-8"))
        }catch(err){
            console.log(err)
            message.channel.send("Error occured in master.json. File reset")
            var backup = JSON.parse(fs.readFileSync("backup.json", "utf-8"))
            fs.writeFile ("master.json", JSON.stringify(backup), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
        }

        try{
            for(i in master){
                if(master[i].gbp == null){
                    master[i].gbp = 0;
                    fs.writeFileSync ("master.json", JSON.stringify(master), {spaces: 2}, function(err) {
                        if (err) throw err;
                        console.log('complete');
                        }
                    );
                }
            }


        
            if(message.author.discriminator !== '9509' && message.author.discriminator !== '0250'){
                if(message.content.startsWith("!") == false){
                    for(i in master){
                        if(person == i){
                            if(master[i].gbp < 0){
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
                        }
                    }
                    fs.writeFileSync ("master.json", JSON.stringify(master), function(err) {
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