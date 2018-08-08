const Discord = require('discord.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const auth = require('./auth.json');

// Create Discord Client Object
const client = new Discord.Client({
  token: auth.token,
  autorun: true
});

// Execute when client is ready
client.on('ready', () => {
  console.log('Connected to as', client.user.username);
});

// Execute when message is sent
client.on('message', (message) => {

  if (message.content.startsWith('!')) {
    var commandList = parseMessage(message);

    // Switch to correct function for command
    switch (commandList[0]) {
      case '!armor':
        console.log('Armor');
        break;
      case '!weapon':
        console.log('Weapon');
        break;
      case '!skill':
        console.log('Skill')
        break;
      case '!item':
        console.log('Item');
        break;
      case '!charm':
        console.log('Charm');
        break;
      case '!decoration':
        console.log('Decoration');
        break;
      default:
        console.log('Command does not exist');

    } // End of Switch-Statement

  } // End of If-Statement
});

client.login(auth.token);


/******************************************************************************
 * HELPER FUNCTIONS
 ******************************************************************************/

/**
 * Parses message into an array separated by spaces
 * @param {Message} message Message to be separated
 */
function parseMessage(message) {
  var m = message.content;
  return m.split(' ')
}

/**
 * Capitalizes first letter in text
 * @param {String} text Text to be capitalized
 */
function capitalize(text) {
  return text[0].toUpperCase() + text.substring(1);
}

//var commandList = parseMessage(message);
  //     // var xhr = new XMLHttpRequest();

  //     // xhr.onreadystatechange = function () {
  //     //   if (this.readyState == 4 && this.status == 200) {
  //     //     var data = JSON.parse(xhr.responseText);
  //     //     for (var i = 0; i < data.length; i++) {
  //     //       if (data[i].name == commandList[1]) {
  //     //         var output =
  //     //           'Armor Set: ' + data[i].name + '\n' +
  //     //           'Rank: ' + capitalize(data[i].rank) + '\n\n' +
  //     //           '__**Armor Pieces**__' + '\n\t' +
  //     //           '**Type:** ' + capitalize(data[i].pieces[0].type) + '\n\t' +
  //     //           '**Rarity:** ' + data[i].pieces[0].rarity + '\n\n\t' +
  //     //           '**Type:** ' + capitalize(data[i].pieces[1].type) + '\n\t' +
  //     //           '**Rarity:** ' + data[i].pieces[1].rarity + '\n\n\t' +
  //     //           '**Type:** ' + capitalize(data[i].pieces[2].type) + '\n\t' +
  //     //           '**Rarity:** ' + data[i].pieces[2].rarity + '\n\n\t' +
  //     //           '**Type:** ' + capitalize(data[i].pieces[3].type) + '\n\t' +
  //     //           '**Rarity:** ' + data[i].pieces[3].rarity + '\n\n\t' +
  //     //           '**Type:** ' + capitalize(data[i].pieces[4].type) + '\n\t' +
  //     //           '**Rarity:** ' + data[i].pieces[4].rarity + '\n\n\t';

  //     xhr.open('GET', 'https://mhw-db.com/armor/sets', true)
  //     xhr.send();

  //   message.delete(1000);
  // }