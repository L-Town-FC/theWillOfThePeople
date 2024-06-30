module.exports = {
    name: 'set',
    description: 'lets me set gbp',
    execute(message,args, master){
        var recipient = args[1];
        var amount = args[2];
        var success = false;
        
        if(message.author.id === '450001712305143869'){    
            for(var i in master){
                if (master[i].name.toLowerCase() == recipient.toLowerCase()){
                    if(isNaN(parseFloat(amount) - 1) == false){
                        master[i].gbp = parseFloat(amount)
                        message.channel.send(`${master[i].name} has been set to ${master[i].gbp} gbp`)
                        success = true
                    }else{
                        message.channel.send("Please enter a real amount")
                        success = true
                    }
                }
            }
            if(success == false){
                message.channel.send("Please enter a valid name")
            }
        }
    }
}