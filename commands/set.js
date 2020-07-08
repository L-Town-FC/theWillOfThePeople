module.exports = {
    name: 'set',
    description: 'lets me set gbp',
    execute(message,args, master){
        const fs = require('fs');
        var recipient = args[1];
        var amount = args[2];
        var success = false;
        
        if(message.author.id === '450001712305143869'){    
            for(i in master){
                if (master[i].name.toLowerCase() == recipient.toLowerCase()){
                    if(isNaN(parseFloat(amount) - 1) == false){
                        master[i].gbp = parseFloat(amount)
                        message.channel.send(`${master[i].name} has been set to ${master[i].gbp} gbp`)
                        var success = true
                        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
                            if (err) throw err;
                            console.log('complete');
                            }
                        );
                    }else{
                        message.channel.send("Please enter a real amount")
                        var success = true
                    }
                }
            }
            if(success == false){
                message.channel.send("Please enter a valid name")
            }
        }
    }
}