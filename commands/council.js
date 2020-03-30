module.exports = {
    name: 'council',
    description: 'gets response from the council',
    execute(message,args){
        test = Math.floor(Math.random()*100);
        if (parseInt(test) > 1){
            message.channel.send('Play one more game of melee and ask again');
        }else{
            message.channel.send('lol Alex gay');
        }
    }

}