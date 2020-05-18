module.exports = {
    name: 'flip',
    description: 'flips coin',
    execute(message,args){
        try{
            result = Math.floor(Math.random()*2);
            if (parseInt(result) == 1){
                message.channel.send('Tails')
            }else{
                message.channel.send('Heads');
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in flip.js Standings");
        }
    }
}