module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message){
        message.channel.send('pong');
    }
}
function find_duplicate_in_array(arra1) {
    var object = {};
    var result = [];

    arra1.forEach(item => {
    if(!object[item])
        object[item] = 0;
        object[item] += 1;
    })

    for (const prop in object) {
    if(object[prop] >= 2) {
        result.push(prop);
    }
    }
    return result;
}