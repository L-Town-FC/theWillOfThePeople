module.exports = {
    name: 'test',
    description: 'new blackjack',
    execute(message, args, master, blackJackHands){
        const general = require('./Functions/GeneralFunctions')
        const MINBET = 15
        args = ['21', '20']

        if(blackJackHands[message.author.id] != undefined){
            SendGameDisplay(message, blackJackHands, message.author.id)
            return
        }

        if(args.length < 2){
            message.channel.send("You must specificy a bet amount")
            return
        }

        if(!general.CommandUsageValidator(message, master, args[1], MINBET, master[message.author.id].gbp, general.defaultRecipient)){
            return
        }
        
        CreateNewGame(message, blackJackHands, message.author.id, args[1], master)
        /*
        Start

        Player tries to start a game
        1. Player is already playing a game so it brings up embed of current game END
        2. Player isnt already playing a game

        Validate if player can start game
        1. if player bets/bank is invalid for game send explanation END
        2. If players bet/bank situation is valid start game

        Create game for player
        1. add player game to blackJackHands object

        Hands are created for player and dealer. 4 possible outcomes
        Player and Dealer dont have blackjack
            -Play begins
        Player has blackjack/ dealer doesnt
            -Hand Win
        Player doesnt have blackjack/ dealer does
            -Hand Loss
        Both player and dealer have blackjack
            -Hand Push

        Hand start. 5 Possible outcomes
        1. Player Hit
            -add card to players hand
            -only able to hit or stay now
            -if bust go to second hand if player split, else go to hand lost
        2. Player Stay
            -Dealer turn
        3. Player Doubledown
            -player gets 1 card and then stays
            -if bust, hand loss
            -if not dealer turn
        4. Player Split
            -can only be done when player hand is size 2 and hasnt split before
            -add two new cards to hand
        5. Can only be done when hand size is 2 and player hasnt split before
            -go Surrender
            
        Dealer turn. Take card. 3 outcomes.
        1. less than hard 17, take card and check again
        2. more than hard 17 less than 22, stay, go to comparison
        3. more than 21, Hand win

        Compare player and dealer hands and go to appropriate outcome

        4 Final outcomes
        Hand Win
        Hand Loss
        Hand Push
        Surrender

       End
       */
    }
}

function CreateNewGame(message, blackJackHands, user, bet, master){
    AddPlayerToHandsArray(blackJackHands, user, bet)
    CreateHands(blackJackHands, user)
    SendGameDisplay(message, blackJackHands, user, master)
}

function AddPlayerToHandsArray(blackJackHands, user, bet){
    blackJackHands[user] = {
        bet: bet,
        currentMessageID: "",
        dealerHand: [],
        dealerDummyHand: [],
        playerHand: [[],[]],
        playerDummyHand:[[],[]],
        playerSplit: false,
        playerStay: [false, false],
        playerBust: [false, false]
    }
}

async function SendGameDisplay(message, blackJackHands, user, master){
    const {ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType} = require('discord.js')
    
    var maxSessionLengthInSeconds = 10

    const hitButton = new ButtonBuilder()
    .setLabel('Hit')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('hit')

    const stayButton = new ButtonBuilder()
    .setLabel('Stay')
    .setStyle(ButtonStyle.Success)
    .setCustomId('stay')

    const doubleDownButton = new ButtonBuilder()
    .setLabel('Double Down')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId('doubleDown')

    const splitButton = new ButtonBuilder()
    .setLabel('Split')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId('split')

    const surrenderButton = new ButtonBuilder()
    .setLabel('Surrender')
    .setStyle(ButtonStyle.Danger)
    .setCustomId('surrender')

    const buttonRow = new ActionRowBuilder().addComponents(hitButton, stayButton, doubleDownButton, splitButton, surrenderButton);

    const reply = await message.reply({embeds: [UpdatedEmbedMessage(message, blackJackHands, user)], components: [buttonRow]})

    const filter = (i) => i.user.id === message.author.id

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
        time: maxSessionLengthInSeconds * 1000
    })

    collector.on('collect', (interaction) =>{
        if(interaction.customId === 'hit'){
            console.log("hit")
            Hit(blackJackHands, user, [splitButton, doubleDownButton, surrenderButton])
        }

        if(interaction.customId === 'stay'){
            console.log("stay")
            Stay(blackJackHands, user, interaction)
        }

        
        if(interaction.customId === 'split'){
            console.log("split")
            Split(blackJackHands, user, interaction)
        }

        
        if(interaction.customId === 'doubleDown'){
            console.log("doubleDown")
            DoubleDown(blackJackHands, user, interaction)
        }

        
        if(interaction.customId === 'surrender'){
            console.log("surrender")
            Surrender(blackJackHands, user, interaction)
        }

        console.log(blackJackHands[user])

        if(DealerHandResolved(blackJackHands, user)){
            GameEnd()
        }

        interaction.update({
            embeds: [UpdatedEmbedMessage(reply, blackJackHands, user)],
            components: [buttonRow]
        })
        
    })

    collector.on('end', () => {
        hitButton.setDisabled(true)
        stayButton.setDisabled(true)
        splitButton.setDisabled(true)
        doubleDownButton.setDisabled(true)
        surrenderButton.setDisabled(true)

        reply.edit({
            embeds: [UpdatedEmbedMessage(reply, blackJackHands, user)],
            components: [buttonRow]
        })
    })
}

//creates hands for both player and dealer at the same time
function CreateHands(blackJackHands, user){
    for (var i = 0; i < 2; i++) {
        var temp = AddCard()
        // blackJackHands[user].playerHand[0].push(temp[0])
        // blackJackHands[user].playerDummyHand[0].push(temp[1])

        //testing only
        blackJackHands[user].playerHand[0].push(11)
        blackJackHands[user].playerDummyHand[0].push('A:diamonds:')
        
        var temp2 = AddCard()
        blackJackHands[user].dealerHand.push(temp2[0])
        blackJackHands[user].dealerDummyHand.push(temp2[1])
    }
}

//creates a card to be used in a hand
//if the card is a 10 it is randomzied as a face card
//if the card is an 11 it becomes an ace
//also adds a random suit to each created card
function AddCard(){
    const CARDVALUES = [2,3,4,5,6,7,8,9,10,10,10,10,11]
    const TENS = ['10','J','Q','K']
    const SUITS = [':diamonds:',':hearts:',':spades:',':clubs:']

    var card = ""
    var dummyCard = ""
    card = dummyCard = CARDVALUES[Math.floor(Math.random()*CARDVALUES.length)];
    if(card == 11){
        dummyCard = "A"
    }

    if(card == 10){
        dummyCard = TENS[Math.floor(Math.random() * TENS.length)]
    }
    
    dummyCard += SUITS[Math.floor(Math.random()*SUITS.length)];
    return [card, dummyCard]
}

function Hit(blackJackHands, user, buttonArray){
    var newCard = AddCard()
    var handIndex = 0

    //determines if player is hitting their first or second hand
    //player can only hit their second hand if they have stayed on their first hand
    if(blackJackHands[user].playerStay[0]){
        index = 1
    }

    //adds numeric value to 'player hand' and card value plus suit to player dummy hand
    blackJackHands[user].playerHand[handIndex].push(newCard[0])
    blackJackHands[user].playerDummyHand[handIndex].push(newCard[1])

    //disables surrender, split, and double down because you arent allowed to do these actions after youve hit
    for (var i = 0; i < buttonArray.length; i++) {
        buttonArray[i].setDisabled(true)
    }

    //checks if players current active hand is over 21. sets them to bust if they are over
    if(PlayerHandValue(blackJackHands, user, handIndex) > 21){
        blackJackHands[user].playerStay[handIndex] = true
        blackJackHands[user].playerBust[handIndex] = true
    }
}

function PlayerHandValue(blackJackHands, user, handIndex){
    var handValue = Sum(blackJackHands[user].playerHand[handIndex])

    var elevenIndex = blackJackHands[user].playerHand[handIndex].indexOf(11)

    if(handValue > 21 && elevenIndex != -1){
        blackJackHands[user].playerHand[handIndex][elevenIndex] = 1
        handValue -= 10
    }

    return handValue
}

function DealerHandResolved(blackJackHands, user){
    if(!blackJackHands[user].playerSplit){
        //player hasnt split and their only hand has busted
        if(blackJackHands[user].playerBust[0]){
            return false
        }

        //player hasnt split and they have stayed
        if(blackJackHands[user].playerStay[0]){
            return false
        }

    }
    return false
}

function UpdatedEmbedMessage(message, blackJackHands, user){
    const embed = require('./Functions/embed_functions')

    var title = "Test"
    var description = `${blackJackHands[user].dealerDummyHand[0]} ${blackJackHands[user].dealerDummyHand[1]}`

    var temp = blackJackHands[user].playerDummyHand
    if(temp.length == 1){
        temp = blackJackHands[user].playerDummyHand[0]
    }
    var fields = {name: "Player Hand", value: temp}
    return embed.EmbedCreator(message, title, description, fields)
}

function Sum(array){
    var sum = 0
    for (var i = 0; i < array.length; i++) {
        sum += array[i]
    }

    return sum
}