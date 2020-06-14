module.exports = {
    name: 'simmerdown',
    description: 'sends number of simmer downs',
    execute(message,args){
        const fs = require('fs');
        var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        var person = args[1];
        var success = false;

        try{
            if(typeof(person) !== 'undefined'){
                for(i in master){
                    if(person.toLowerCase() == master[i].name.toLowerCase()){
                        message.channel.send(`${master[i].name} has said "simmer down" ${master[i].simmerdown} time(s)`);
                        success = true
                    }
                }
                if(success === false){
                    message.channel.send('Please specify a valid name after !simmerdown');
                }
            }else{
                message.channel.send(`${master[message.author.id].name} has said "simmer down" ${master[message.author.id].simmerdown} time(s)`);
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in simmerdown.js");
        }
    }
}