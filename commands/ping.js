module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message){
        message.channel.send('pong');
    }
}