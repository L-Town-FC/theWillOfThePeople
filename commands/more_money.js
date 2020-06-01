module.exports = {
    name: 'more_money',
    description: 'gives 1 gbp every message',
    execute(message){

        const fs = require('fs');
        var master = JSON.parse(fs.readFileSync("master.json", "utf-8"))
        var person = message.author.id
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
                            master[i].gbp = Math.round((parseFloat(master[i].gbp) + 1) * 100)/100
                        }
                    }
                    fs.writeFileSync ("master.json", JSON.stringify(master), {spaces: 2}, function(err) {
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