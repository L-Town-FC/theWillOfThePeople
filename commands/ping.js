module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message, bot){
        message.channel.send('pong');
        var user = bot.users.find(user => user.id === message.author.id)
        user.send('Good')
    }
}
