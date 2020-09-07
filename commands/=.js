module.exports = {
    name: '=',
    description: 'basic calculator',
    execute(message, args, master){
        try{
            if(message.author.bot == true){
                return
            }else{
            var command = String(args[1]).toLowerCase() || 'none'
                if(isNaN(command) == false){
                    Calculator(message, args)
                }else{
                    message.channel.send('!= [number] [operator] [number]. Operators are [+,-,*,/,^]')
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in =.js')
        }
    }
}

function Calculator(message, args){
    var command = String(args[3]).toLowerCase() || 'none'
    var answer
    if(isNaN(command) == false){
        var num1 = parseFloat(args[1])
        var num2 = parseFloat(args[3])
        switch(args[2]){
            case '+':
                answer = num1 + num2
            break;
            case '-':
                answer = num1 - num2
            break;
            case '*':
                answer = num1 * num2
            break;
            case '/':
                answer = num1 / num2
            break;
            case '^':
                answer = Math.pow(num1, num2)
            break;
            default:
                message.channel.send('You must use one of the following operators [+,-,*,/,^]')
        }
        if(typeof(answer) !== 'undefined'){
            message.channel.send(answer)
        }
    }else{
        message.channel.send('You must choose two numbers')
    }
}

function Help(message){
    const fs = require('fs')
    const Discord = require('discord.js')
}