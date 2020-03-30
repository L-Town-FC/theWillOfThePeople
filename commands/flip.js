module.exports = {
    name: 'flip',
    description: 'says pong',
    execute(message,args){
        result = Math.floor(Math.random()*2);
        if (parseInt(result) == 1){
            message.channel.send('Tails')
        }else{
            message.channel.send('Heads');
        }
    }

}