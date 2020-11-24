module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message, bot){
        message.channel.send('pong');
    }
}
