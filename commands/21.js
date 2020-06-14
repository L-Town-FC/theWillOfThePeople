module.exports = {
    name: '21',
    description: 'A better blackjack',
    execute(message,args,total_money){
        const fs = require('fs');
        const Discord = require('discord.js');
        const suit = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
        //list of possible cards. Have multiple tens to account for J, Q, and K. 11 is for A
        const tens = ['10','J','Q','K']
        //used to convert 10s into other cards
        var new_bet = args[2];
        var min_bet = 15;
        var command = args[1];
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))

        if(typeof(master_list) == 'undefined'){
            master_list = []; 
            var counter = 0
            for (i in master){
                master_list[counter] = {
                    name: master[i].name,
                    id: i,
                    player_hand1: [],
                    player_dummy_hand1: [],
                    player_hand2: [],
                    player_dummy_hand2: [],
                    dealer_hand: [],
                    dealer_dummy_hand: [],
                    bet: "",
                    gameStatus: 0,
                    isStay: [false, true],
                    blackjack: false,
                    isSplit: false
                }
                counter = counter + 1
            }
        }
        for(i = 0; i < master_list.length; i++){
            if(master_list[i].id == message.author.id){
                player = i;
            }
        }
        
        switch (String(command).toLowerCase()){
            case 'deal':
                try{
                    if (typeof(new_bet) == 'undefined'){
                        message.channel.send("Please specify the amount of gbp you want to bet")
                    }else if(parseFloat(new_bet) > parseFloat(total_money)){
                        message.channel.send("You don't have enough gbp for that bet");
                    }else if(parseFloat(new_bet) < parseFloat(min_bet)){
                        message.channel.send(`You must bet at least ${min_bet} gbp`)
                    }else if(isNaN(parseFloat(new_bet)-1) == true){   
                        message.channel.send("Please use a number for your bet")
                    }else if(master_list[player].gameStatus !== 0){
                        message.channel.send("You are already playing a game")
                    }else{
                        master_list[player].bet = [parseFloat(new_bet), 0]
                        master_list[player].gameStatus = 1;
                        var card = [];
                        var dummycard = [];
                        for (i = 0; i < 4; i++) {
                            card[i] = suit[Math.floor(Math.random()*suit.length)];
                            //generates cards for dealer and player
                        }

                        // Test Cards
                        //card[0] = 10;
                        //card[1] = 10;
                        //card[2] = 10;
                        //card[3] = 10;
                        //

                        master_list[player].player_hand1 = [card[0], card[1]];
                        master_list[player].dealer_hand = [card[2], card[3]];

                        for (i = 0; i < card.length; i++) {
                            if (card[i] == 10){
                                dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                            }else if (card[i] == 11){
                                dummycard[i] = 'A';
                            }else{
                                dummycard[i] = card[i];
                            }
                        }

                        //Test Cards
                        //dummycard[0] = 'J'
                        //dummycard[1] = 'J'
                        //

                        master_list[player].player_dummy_hand1 = [dummycard[0], dummycard[1]]
                        master_list[player].dealer_dummy_hand = [dummycard[2], dummycard[3]]

                        Display_Status(master_list[player],message)
                        purchase(new_bet, message.author.id, message, master) 

                        if(master_list[player].dealer_dummy_hand[0] == 'A'){
                            if(master_list[player].dealer_hand[1] == 10){
                                master_list[player].gameStatus = 2
                                var blackjack = true
                                master_list[player].isStay[0] = true
                            }else{
                                setTimeout(function(){
                                    message.channel.send("Dealer doesn't have blackjack")
                                }, 50)
                            }
                        }else if(sum(master_list[player].dealer_hand) == 21){
                            master_list[player].gameStatus = 2
                            var blackjack = true
                            master_list[player].isStay[0] = true
                        }else{
                            var blackjack = false
                        }
                        if(sum(master_list[player].player_hand1) == 21){
                            master_list[player].isStay[0] = true
                            if(blackjack == true){
                                master_list[player].gameStatus = 4
                            }else{
                                master_list[player].gameStatus = 3
                            }
                        }
                    }
                    /*Checks the various cases where a bet may be invalid such as when no bet is specified, you bet more gbp than you have
                    you bet less than the minimum bet, you use a non-number as a bet, and when you have already made a bet */
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in 21.js Deal")
                }
            break;
            case 'hit':
                try{
                    if(master_list[player].gameStatus == 1){
                        var cards = New_Card(suit,tens)
                        if(master_list[player].isStay[0] == true){
                            master_list[player].player_hand2.push(cards[0]);
                            master_list[player].player_dummy_hand2.push(cards[1]);
                            message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                            if(sum(master_list[player].player_hand2) > 21){
                                if (master_list[player].player_hand2.indexOf(11) !== -1){
                                    master_list[player].player_hand2[master_list[player].player_hand2.indexOf(11)] = 1;
                                }else{
                                    message.channel.send(`${master_list[player].name} hand 2 busts`)
                                    master_list[player].isStay[1] = true
                                    master_list[player].gameStatus = 11
                                }
                            }
                        }else{
                            master_list[player].player_hand1.push(cards[0]);
                            master_list[player].player_dummy_hand1.push(cards[1]);
                            message.channel.send(`${master_list[player].name} Hand 1: ${master_list[player].player_dummy_hand1}`)
                            if(sum(master_list[player].player_hand1) > 21){
                                if (master_list[player].player_hand1.indexOf(11) !== -1){
                                    master_list[player].player_hand1[master_list[player].player_hand1.indexOf(11)] = 1;
                                    if(sum(master_list[player].player_hand1) > 21){
                                        master_list[player].player_hand1[master_list[player].player_hand1.indexOf(11)] = 1;
                                    }
                                }else{
                                    master_list[player].isStay[0] = true
                                    if(master_list[player].isSplit == false){
                                        master_list[player].gameStatus = 5; 
                                    }else{
                                        message.channel.send(`${master_list[player].name} hand 1 busts`)
                                        message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                                    }
                                }
                            }
                        }
                        if(master_list[player].gameStatus == 5){
                            message.channel.send("Player busts") 
                        }
                    }else{
                        message.channel.send("There currently isn't a game being played");
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in !21.js Hit")
                }
            break;
            case 'split':
                try{
                    if(parseFloat(total_money) >= parseFloat(master_list[player].bet)){
                        if(master_list[player].player_dummy_hand1[0] === master_list[player].player_dummy_hand1[1] && master_list[player].isSplit == false && master_list[player].player_hand1.length == 2){
                            var card_0 = master_list[player].player_hand1[0]
                            var card_1 = master_list[player].player_hand1[1]
                            var dummy_card_0 = master_list[player].player_dummy_hand1[0]
                            var dummy_card_1 = master_list[player].player_dummy_hand1[1]

                            var card = [];
                            var dummycard = [];
                            for (i = 0; i < 2; i++) {
                                card[i] = suit[Math.floor(Math.random()*suit.length)];
                                //generates cards for dealer and player
                            }

                            master_list[player].player_hand1 = [card_0, card[0]];
                            master_list[player].player_hand2 = [card_1, card[1]];

                            for (i = 0; i < card.length; i++) {
                                if (card[i] == 10){
                                    dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                                }else if (card[i] == 11){
                                    dummycard[i] = 'A';
                                }else{
                                    dummycard[i] = card[i];
                                }
                            }

                            master_list[player].player_dummy_hand1 = [dummy_card_0, dummycard[0]]
                            master_list[player].player_dummy_hand2 = [dummy_card_1, dummycard[1]]

                            purchase(parseFloat(master_list[player].bet[0]), message.author.id, message, master);
                            
                            var bet = master_list[player].bet;
                            master_list[player].bet = [bet[0],bet[0]]
                            master_list[player].isSplit = true;
                            
                            if(master_list[player].player_dummy_hand1[0] === 'A'){ //Set this to 'A' when done
                                master_list[player].isStay = [true, true]
                                master_list[player].gameStatus = 11
                            }else{
                                master_list[player].isStay = [false, false]
                            }
                            
                            Display_Status(master_list[player],message)

                        }else if(master_list[player].isSplit == true){
                            message.channel.send("You can't resplit cards")
                        }else if(master_list[player].player_hand1.length > 2){
                            message.channel.send("You can't split after you have already hit")
                        }else if(master_list[player].gameStatus == 0){
                            message.channel.send("There currently isn't a hand being played")
                        }else{
                            message.channel.send("You can't split because your cards don't match")
                        }
                    }else{
                        message.channel.send("You don't have enough money to split")
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in 21.js Split")
                }
            break;
            case 'doubledown':
                try{
                    if(master_list[player].gameStatus == 1){
                        var cards = New_Card(suit,tens)
                        if(master_list[player].isStay[0] == true){
                            if(master_list[player].player_hand2.length == 2){
                                if(total_money < master_list[player].bet[1]){
                                    message.channel.send(`You could not fully double down. Your new bet is ${master_list[player].bet[1] + total_money}`)
                                    purchase(total_money, message.author.id, message, master)
                                    master_list[player].bet[1] = parseFloat(total_money) + parseFloat(master_list[player].bet[1])
                                }else{
                                    purchase(master_list[player].bet[1], message.author.id, message, master)
                                    message.channel.send(`Your new bet is ${2 * master_list[player].bet[1]}`)
                                    master_list[player].bet[1] = 2 * parseFloat(master_list[player].bet[1])
                                }
                                master_list[player].isStay[1] = true
                                master_list[player].player_hand2.push(cards[0]);
                                master_list[player].player_dummy_hand2.push(cards[1]);
                                message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                                if(sum(master_list[player].player_hand2) > 21){
                                    if (master_list[player].player_hand1.indexOf(11) !== -1){
                                        master_list[player].player_hand1[master_list[player].player_hand1.indexOf(11)] = 1;
                                    }else{
                                        message.channel.send(`${master_list[player].name} hand 2 busts`)
                                        master_list[player].isStay[1] = true
                                    }
                                }
                                master_list[player].gameStatus = 11
                            }else{
                                message.channel.send("You can't doubledown after you have already hit once")
                            }
                        }else{
                            if(master_list[player].player_hand1.length == 2){
                                if(total_money < master_list[player].bet[0]){
                                    message.channel.send(`You could not fully double down. Your new bet is ${master_list[player].bet[0] + total_money}`)
                                    purchase(total_money, message.author.id, message, master)
                                    master_list[player].bet[0] = parseFloat(total_money) + parseFloat(master_list[player].bet[0])
                                }else{
                                    purchase(master_list[player].bet[0], message.author.id, message, master)
                                    message.channel.send(`Your new bet is ${2 * master_list[player].bet[0]}`)
                                    master_list[player].bet[0] = 2 * parseFloat(master_list[player].bet[0])
                                }
                                master_list[player].isStay[0] = true
                                master_list[player].player_hand1.push(cards[0]);
                                master_list[player].player_dummy_hand1.push(cards[1]);
                                message.channel.send(`${master_list[player].name} Hand 1: ${master_list[player].player_dummy_hand1}`)
                                if(sum(master_list[player].player_hand1) > 21){
                                    if (master_list[player].player_hand1.indexOf(11) !== -1){
                                        master_list[player].player_hand1[master_list[player].player_hand1.indexOf(11)] = 1;
                                        if(sum(master_list[player].player_hand1) > 21){
                                            master_list[player].player_hand1[master_list[player].player_hand1.indexOf(11)] = 1;
                                        }
                                    }else{
                                        master_list[player].isStay[0] = true
                                        if(master_list[player].isSplit == false){
                                            master_list[player].gameStatus = 5; 
                                        }else{
                                            message.channel.send(`${master_list[player].name} hand 1 busts`)
                                        }
                                    }
                                }
                                if(master_list[player].isSplit == true){
                                    message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                                }
                            }else{
                                message.channel.send("You can't doubledown after you have already hit once")
                            }
                        }
                        if(master_list[player].gameStatus == 5){
                            message.channel.send("Player busts") 
                        }
                    }else{
                        message.channel.send("There currently isn't a game being played");
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in !21.js Doubledown")
                }
            break;
            case 'status':
                try{
                    if(master_list[player].gameStatus == 1){
                        Display_Status(master_list[player],message)
                    }else{
                        message.channel.send("There currently isn't a game being played")
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in 21.js Status")
                }
            break;
            case 'stay':
                try{
                    if(master_list[player].gameStatus !== 0){
                        if(master_list[player].isStay[0] == true){
                            master_list[player].isStay[1] = true;
                            master_list[player].gameStatus = 11;
                        }else{
                            master_list[player].isStay[0] = true;
                            if(master_list[player].isSplit == true){
                                message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                            }
                        }
                    }else{
                        message.channel.send("You aren't playing a game")
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in !21.js Stay")
                }
            break;
            case 'surrender':
                try{
                    if(master_list[player].player_hand1.length > 2){
                        message.channel.send("You can't surrender after you have already hit")
                    }else if(master_list[player].isSplit == true){
                        message.channel.send("You can't surrender after you have already split")
                    }else if(master_list[player].gameStatus == 0){
                        message.channel.send("There currently isn't a game being played")
                    }else{
                        message.channel.send("Coward")
                        master_list[player].isStay[0] = true;
                        master_list[player].gameStatus = 10
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in !21.js Surrender")
                }
            break;
            case 'reset':
                reset(master_list, player)
            break;
            case 'help':
                try{
                    var blackjack_commands = fs.readFileSync('./text_files/blackjack_commands.txt','utf8');
                    const help_embed = new Discord.RichEmbed()
                    .addField('List of Commands', blackjack_commands);
                    message.channel.send(help_embed);
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in 21.js Help");
                }
            break;

            default:
                message.channel.send('Use "!21 help for a list of commands')
        }
        try{
            if(master_list[player].isSplit == true && master_list[player].gameStatus !== 1){
                if(sum(master_list[player].player_hand1) <= 21 || master_list[player].player_dummy_hand1 == ['A','A']){
                    var hand1_bust = false;
                }else{
                    var hand1_bust = true;
                }

                if(sum(master_list[player].player_hand2) <= 21|| master_list[player].player_dummy_hand2 == ['A','A']){
                    var hand2_bust = false;
                }else{
                    var hand2_bust = true;
                }
                if(hand1_bust == false || hand2_bust == false){
                    if(sum(master_list[player].dealer_hand) > 21){
                        if (master_list[player].dealer_hand.indexOf(11) !== -1){
                            master_list[player].dealer_hand[master_list[player].dealer_hand.indexOf(11)] = 1;
                        }
                    }
                    setTimeout(function(){
                        while(sum(master_list[player].dealer_hand) < 17){
                            var cards = New_Card(suit,tens)
                            master_list[player].dealer_hand.push(cards[0]);
                            master_list[player].dealer_dummy_hand.push(cards[1]);
                            message.channel.send(`Dealer hand: ${master_list[player].dealer_dummy_hand}`)
                            if(sum(master_list[player].dealer_hand) > 21){
                                if (master_list[player].dealer_hand.indexOf(11) !== -1){
                                    master_list[player].dealer_hand[master_list[player].dealer_hand.indexOf(11)] = 1;
                                }else{
                                    master_list[player].gameStatus = 12
                                    message.channel.send("Dealer busts")
                                }
                            }  
                        }
                    }, 20)
                    Display_Final(master_list[player], message)
                    setTimeout(function(){    
                        if(master_list[player].gameStatus == 12){
                            var winnings = 0
                            if(hand1_bust == false){
                                purchase(-2 * parseFloat(master_list[player].bet[0]), message.author.id, message, master);
                                winnings = winnings + parseFloat(master_list[player].bet[0])
                            }
                            if(hand2_bust == false){
                                purchase(-2 * parseFloat(master_list[player].bet[1]), message.author.id, message, master)
                                winnings = winnings + parseFloat(master_list[player].bet[1])
                            }
                            message.channel.send(`${master_list[player].name} wins ${winnings} gbp`)

                            reset(master_list, player)

                        }else{
                            var winnings = 0
                            if(master_list[player].player_dummy_hand1 == ['A','A']){
                                master_list[player].player_hand1 = [11, 1]
                            }
                            if(master_list[player].player_dummy_hand2 == ['A','A']){
                                master_list[player].player_hand2 = [11, 1]
                            }
                            
                            if(sum(master_list[player].player_hand1) > sum(master_list[player].dealer_hand) && hand1_bust == false){
                                purchase(-2 * parseFloat(master_list[player].bet[0]), message.author.id, message, master);
                                winnings = winnings + parseFloat(master_list[player].bet[0])
                                message.channel.send(`${master_list[player].name} wins hand 1 and ${master_list[player].bet[0]} gbp`)
                            }else if(sum(master_list[player].player_hand1) == sum(master_list[player].dealer_hand)){
                                purchase(-1 * parseFloat(master_list[player].bet[0]), message.author.id, message, master);
                                winnings = winnings + parseFloat(master_list[player].bet[0])
                                message.channel.send(`Dealer pushes hand 1`)
                            }else{
                                message.channel.send("Dealer wins hand 1")
                                winnings = 0
                            }
                
                            if(sum(master_list[player].player_hand2) > sum(master_list[player].dealer_hand) & hand2_bust == false){
                                purchase(-2 * parseFloat(master_list[player].bet[1]), message.author.id, message, master)
                                winnings = winnings + parseFloat(master_list[player].bet[1])
                                message.channel.send(`${master_list[player].name} wins hand 2 and ${master_list[player].bet[0]} gbp`)
                            }else if(sum(master_list[player].player_hand2) == sum(master_list[player].dealer_hand)){
                                purchase(-1 * parseFloat(master_list[player].bet[0]), message.author.id, message, master);
                                winnings = winnings + parseFloat(master_list[player].bet[0])
                                message.channel.send(`Dealer pushes hand 2`)
                            }else{
                                winnings = winnings
                                message.channel.send("Dealer wins hand 2")
                            }

                            reset(master_list, player)
                        }
                    }, 20)
                }else{
                    message.channel.send(`Dealer's Hand: ${master_list[player].dealer_dummy_hand}`)
                    message.channel.send("Dealer wins")
                }
            }else if(master_list[player].isSplit == false && master_list[player].isStay[0] == true){
                if(master_list[player].isStay[0] == true){
                    message.channel.send(`Dealer hand: ${master_list[player].dealer_dummy_hand}`)
                    if([2,3,4,5,10].includes(master_list[player].gameStatus) == false){    
                        if(sum(master_list[player].dealer_hand) > 21){
                            if (master_list[player].dealer_hand.indexOf(11) !== -1){
                                master_list[player].dealer_hand[master_list[player].dealer_hand.indexOf(11)] = 1;
                            }
                        }
                        while(sum(master_list[player].dealer_hand) < 17){
                            var cards = New_Card(suit,tens)
                            master_list[player].dealer_hand.push(cards[0]);
                            master_list[player].dealer_dummy_hand.push(cards[1]);
                            
                            if(sum(master_list[player].dealer_hand) > 21){
                                if (master_list[player].dealer_hand.indexOf(11) !== -1){
                                    master_list[player].dealer_hand[master_list[player].dealer_hand.indexOf(11)] = 1;
                                }else{
                                    master_list[player].gameStatus = 6
                                }
                            }
                            message.channel.send(`Dealer hand: ${master_list[player].dealer_dummy_hand}`)            
                            
                        }
                    }
                    if([2,3,4,5,6,10].includes(master_list[player].gameStatus) == false){
                        if(sum(master_list[player].player_hand1) == sum(master_list[player].dealer_hand)){
                            master_list[player].gameStatus = 7
                        }else if(sum(master_list[player].player_hand1) < sum(master_list[player].dealer_hand)){
                            master_list[player].gameStatus = 8
                        }else{
                            master_list[player].gameStatus = 9
                        }
                    }
                    setTimeout(function(){ 
                        switch(master_list[player].gameStatus){
                            case 2:
                                message.channel.send("Dealer has blackjack")
                                message.channel.send("Dealer wins")
                            break;
                            case 3:
                                message.channel.send("Player has blackjack")
                                message.channel.send("Player wins")
                                message.channel.send(`${master_list[player].name} wins ${1.5 * parseFloat(master_list[player].bet[0])} gbp`)
                                purchase(-2.5 * parseFloat(master_list[player].bet[0]), message.author.id, message, master)

                            break;
                            case 4:
                                message.channel.send("Player has blackjack")
                                message.channel.send("Dealer has blackjack")
                                message.channel.send("Player pushes")
                                purchase(-1 * parseFloat(master_list[player].bet[0]), message.author.id, message, master)
                            break;
                            case 5:
                                message.channel.send("Dealer wins") 
                            break;
                            case 6:
                                message.channel.send("Dealer busts")
                                message.channel.send("Player wins")
                                message.channel.send(`${master_list[player].name} wins ${1 * parseFloat(master_list[player].bet[0])} gbp`)
                                purchase(-2 * parseFloat(master_list[player].bet[0]), message.author.id, message, master)
                            break;
                            case 7:
                                message.channel.send("Player pushes")
                                purchase( -1 * parseFloat(master_list[player].bet[0]), message.author.id, message, master)
                            break;
                            case 8:
                                message.channel.send("Dealer wins")
                            break;
                            case 9:
                                message.channel.send("Player wins")
                                message.channel.send(`${master_list[player].name} wins ${1 * parseFloat(master_list[player].bet[0])} gbp`)
                                purchase(-2 * master_list[player].bet[0], message.author.id, message, master) 
                            break;
                            case 10:
                                purchase(-0.5 * parseFloat(master_list[player].bet[0]), message.author.id, message, master)
                                message.channel.send(`You recieved ${.5 * parseFloat(master_list[player].bet[0])} gbp back`)
                            break;

                            /*
                            Game Status: 
                                0 - No game ongoing
                                1 - Game ongoing
                                2 - Dealer has blackjack
                                3 - Player has blackjack
                                4 - Both have blackjack
                                5 - Player Busts
                                6 - Dealer Busts
                                7 - Player pushes
                                8 - Dealer wins without bust
                                9 - Player wins without bust
                                10 - Player Surrenders
                                11 - Player Split Options
                            */
                        }
                        reset(master_list, player)
                    }, 10)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occured in !21.js Outcome")
        }
    }
}


function purchase(bet_value, player, message, master) {
    try{
        const fs = require('fs');
        //var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        for(i in master){
            if(player == i){
                master[message.author.id].gbp = parseFloat(master[message.author.id].gbp) - parseFloat(bet_value)
            }
        }


        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in 21.js Purchase");
    }

}

function New_Card(suit, tens){
    try{
        var dummycard = "";
        var card = suit[Math.floor(Math.random()*suit.length)];
        if (card == 10){
            dummycard = tens[Math.floor(Math.random()*tens.length)];
        }else if (card == 11){
            dummycard = 'A';
        }else{
            dummycard = card;
        }
        return [card, dummycard]
    }catch(err){
        console.log(err)
        message.channel.send("Error occured in new21.js New_Card")
    }
}

function Display_Status(master_list, message){
    const Discord = require('discord.js')
    var current_bet = master_list.bet;
    var current_hand1 = master_list.player_dummy_hand1;
    var current_hand2 = master_list.player_dummy_hand2;
    var dealer_hand = master_list.dealer_dummy_hand;
    if(current_hand2.length == 0){
        var blackjack_stats = `Dealer's hand: ${dealer_hand[0]} ?\nPlayer's hand: ${current_hand1} \nCurrent bet: ${current_bet[0]}`
    }else{
        var blackjack_stats = `Dealer's hand: ${dealer_hand[0]} ?\nPlayer's hand 1: ${current_hand1} \nPlayer's Hand 2: ${current_hand2} \nCurrent bet: ${current_bet[0]}|${current_bet[1]}`
    }
    const blackjack_stats_embed = new Discord.RichEmbed()
    .addField(`${master_list.name} Game Status:`, blackjack_stats);
    message.channel.send(blackjack_stats_embed);
}
function Display_Final(master_list, message){
    const Discord = require('discord.js')
    var current_bet = master_list.bet;
    var current_hand1 = master_list.player_dummy_hand1;
    var current_hand2 = master_list.player_dummy_hand2;
    var dealer_hand = master_list.dealer_dummy_hand;
    if(current_hand2.length == 0){
        var blackjack_stats = `Dealer's hand: ${dealer_hand} \nPlayer's hand: ${current_hand1} \nCurrent bet: ${current_bet[0]}`
    }else{
        var blackjack_stats = `Dealer's hand: ${dealer_hand} \nPlayer's hand 1: ${current_hand1} \nPlayer's Hand 2: ${current_hand2} \nCurrent bet: ${current_bet[0]}|${current_bet[1]}`
    }
    const blackjack_stats_embed = new Discord.RichEmbed()
    .addField(`${master_list.name} Game Status:`, blackjack_stats);
    message.channel.send(blackjack_stats_embed);
}


function sum(arr) {
    //function to sum hands
    var s = 0

    for (var j = 0; j < arr.length; j++){
        s = arr[j] + s;
    }
    return s;
}
function reset(master_list, player){
    master_list[player].player_hand1 = [];
    master_list[player].player_hand2 = [];
    master_list[player].player_dummy_hand1 = [];
    master_list[player].player_dummy_hand2 = [];
    master_list[player].dealer_hand = [];
    master_list[player].dealer_dummy_hand = [];
    master_list[player].bet = "";
    master_list[player].gameStatus = 0;
    master_list[player].isStay = [false, true];
    master_list[player].blackjack = false;
    master_list[player].isSplit = false
}