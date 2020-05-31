module.exports = {
    name: 'test',
    description: 'json tester',
    execute(message,args){
        const fs = require('fs')
        var command = args[1];
        var test = fs.readFileSync("master.json", "utf-8")
        var test1 = JSON.parse(test)
        for(i in test1){
            if(message.author.id == i){
                test1[message.author.id].gbp = test1[message.author.id].gbp + 1;
            }
        }

        if(typeof(command) !== 'undefined'){
            console.log("here")
            for(i in test1){
                console.log(test1[i].name)
            }
        }

        fs.writeFileSync ("master.json", JSON.stringify(test1), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }

}