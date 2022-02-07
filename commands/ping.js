module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message, fauna_token, master, bot){
        message.channel.send('pong');
        Test(bot, message);
        
    }
}

function Test(bot, message){

}

