
//grabs the users color and sets the embeds color to match the users
//if no color is detected it defaults to black
function Color(message){
    if(message.member !== null){
        var roles = message.member.roles.cache.array()
        var position_array = []
        for(i in roles){
            position_array.push(roles[i].position)
        }
        var max_position = Math.max(...position_array)
        var position_of_max = position_array.indexOf(max_position)
        return roles[position_of_max].color
    }else{
        return 0o0
    }
}

module.exports.Color = Color