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
    message.delete(1000);

    getData(message, commandList);
  } // End of If-Statement
});

client.login(auth.token);


/*******************************************************************************
 * COMMAND FUNCTIONS
 ******************************************************************************/

function getDecoration(message, data) {
  // Description Text
  bodyText =
    'Decoration' + '\n' +
    'Rarity: ' + data.rarity + '\n';

  // Set message properties
  var output = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle(data.name)
    .setDescription(bodyText)
    .setThumbnail('https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/artillery_charm_i-mhw.png')

  // Get all versions of the skill
  if (data.skills.length > 0) {
    var skill = '';
    for (var i = 0; i < data.skills.length; i++) {
      skill +=
        data.skills[i].skillName +
        ' (Level ' + data.skills[i].level + ')\n' +
        '- ' + data.skills[i].description + '\n\n'
    }

    output.addField('Skills', skill);
  }

  message.channel.send(output)
}


/*******************************************************************************
 * Sends message card of Charm
 * @param {Message} message Message from Discord.Client
 * @param {Object} data Data recieved from XHR
 */
function getCharm(message, data) {
  for (var i = 0; i < data.ranks.length; i++) {
    // Description Text
    bodyText =
      'Charm' + '\n' +
      'Rarity: ' + data.ranks[i].rarity + '\n';

    // Set message properties
    var output = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setTitle(data.ranks[i].name)
      .setDescription(bodyText)
      .setThumbnail('https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/artillery_charm_i-mhw.png')

    // Get all versions of the skill
    if (data.ranks[i].skills.length > 0) {
      var skill = '';
      for (var j = 0; j < data.ranks[i].skills.length; j++) {
        skill +=
          data.ranks[i].skills[j].skillName +
          ' (Level ' + data.ranks[i].skills[j].level + ')\n' +
          '- ' + data.ranks[i].skills[j].description + '\n\n'
      }

      output.addField('Skills', skill);
    }

    // Display in footer, if weapon is craftable
    if (data.ranks[i].crafting.craftable == true) {
      var footer = 'Crafting Material: ';
      for (var j = 0; j < data.ranks[i].crafting.materials.length; j++) {
        footer +=
          data.ranks[i].crafting.materials[j].quantity + ' ' +
          data.ranks[i].crafting.materials[j].item.name

        if (j != data.ranks[i].crafting.materials.length - 1) {
          footer += ', '
        }
      }

      output.setFooter(footer);
    }

    message.channel.send(output)
  }
}

/*******************************************************************************
 * Sends message card of Item
 * @param {Message} message Message from Discord.Client
 * @param {Object} data Data recieved from XHR
 */
function getItem(message, data) {
  // Description Text
  var bodyText =
    data.description + '\n\n' +
    'Rarity: ' + data.rarity + '\n' +
    'Carry Limit: ' + data.carryLimit + '\n' +
    'Sell Price: ' + data.sellPrice + '\n' +
    'Buy Price: ' + data.buyPrice;

  // Set message properties
  var output = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle(data.name)
    .setDescription(bodyText)
    .setThumbnail('https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/monster-bone-s-mhw.png')

  message.channel.send(output)
}


/*******************************************************************************
 * Sends message card of Skill
 * @param {Message} message Message from Discord.Client
 * @param {Object} data Data recieved from XHR
 */
function getSkill(message, data) {
  // Set message properties
  var output = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle(data.name);

  for (var i = 0; i < data.ranks.length; i++) {
    output.addField('Rank ' + data.ranks[i].level, data.ranks[i].description)
  }

  message.channel.send(output)
}

/*******************************************************************************
 * Sends message card of Weapon
 * @param {Message} message Message from Discord.Client
 * @param {Object} data Data recieved from XHR 
 */
function getWeapon(message, data) {

  // Correctly Display Weapon Type
  if (data.type.indexOf('-') != -1) {
    var text = data.type.split('-');
    for (var i = 0; i < text.length; i++) {
      if (text[i] == 'and') i++;
      text[i] = capitalize(text[i])
    }
    var type = text.join(' ');
  } else {
    var type = capitalize(data.type);
  }

  // Attribute Description Description
  var attributes = "";
  // Loop Through Attributes Object
  for (item in data.attributes) {
    if (item != 'ammoCapacities' && item != 'coatings') {
      if (item == 'specialAmmo') attributes += 'Special Ammo: ';
      else attributes += capitalize(item) + ': ';

      // Capitalize value if it is a string
      if (typeof data.attributes[item] == 'string') {
        attributes += capitalize(data.attributes[item]);
      } else {
        attributes += data.attributes[item];
      }

      // Add Percent symbol if it is an affinity
      if (item == 'affinity') attributes += '%'
      attributes += '\n'
    }
  }

  // Create RichEmbed Object
  var output = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle(data.name)
    .setThumbnail(data.assets.image)
    .setDescription(type + ' \nRarity: ' + data.rarity)

  // Check if there are any elemental damage on weapon
  if (data.elements.length > 0) {
    attributes += '\n**Elemental**\n'
    for (var i = 0; i < data.elements.length; i++) {
      attributes +=
        'Type: ' + capitalize(data.elements[i].type) + '\n' +
        'Damage: ' + data.elements[i].damage + '\n\n'
    } // End of for-loop
  } // End of if-statement

  output.addField('Attributes', attributes, true)

  // Check if Weapon type is not a bow, light bowgun or heavy bowgun
  if (data.type != 'bow' && data.type != 'light-bowgun' &&
    data.type != 'heavy-bowgun') {

    // Sharpness Description
    var sharpness =
      'Red: ' + data.sharpness.red + '\n' +
      'Orange: ' + data.sharpness.orange + '\n' +
      'Yellow: ' + data.sharpness.yellow + '\n' +
      'Green: ' + data.sharpness.green + '\n' +
      'Blue: ' + data.sharpness.blue + '\n' +
      'White: ' + data.sharpness.white + '\n';

    output.addField('Sharpness', sharpness, true);
  }
  // Check if Weapon Type uses Ammunition
  else if (data.type == 'light-bowgun' || data.type == 'heavy-bowgun') {
    var ammoCapacity =
      'Normal: ' + data.attributes.ammoCapacities.normal + ' | ' +
      'Piercing: ' + data.attributes.ammoCapacities.piercing + ' | ' +
      'Spread: ' + data.attributes.ammoCapacities.spread + ' | ' +
      'Sticky: ' + data.attributes.ammoCapacities.sticky + '\n' +
      'Cluster: ' + data.attributes.ammoCapacities.cluster + ' | ' +
      'Recover: ' + data.attributes.ammoCapacities.recover + ' | ' +
      'Poison: ' + data.attributes.ammoCapacities.poison + ' | ' +
      'Paralysis: ' + data.attributes.ammoCapacities.paralysis + '\n' +
      'Sleep: ' + data.attributes.ammoCapacities.sleep + ' | ' +
      'Exhaust: ' + data.attributes.ammoCapacities.exhaust + ' | ' +
      'Flaming: ' + data.attributes.ammoCapacities.flaming + ' | ' +
      'Water: ' + data.attributes.ammoCapacities.water + '\n' +
      'Freeze: ' + data.attributes.ammoCapacities.freeze + ' | ' +
      'Thunder: ' + data.attributes.ammoCapacities.thunder + ' | ' +
      'Dragon: ' + data.attributes.ammoCapacities.dragon + ' | ' +
      'Slicing: ' + data.attributes.ammoCapacities.slicing + '\n' +
      'Wyvern: ' + data.attributes.ammoCapacities.wyvern + ' | ' +
      'Demon: ' + data.attributes.ammoCapacities.demon + ' | ' +
      'Armor: ' + data.attributes.ammoCapacities.armor + ' | ' +
      'Tranq: ' + data.attributes.ammoCapacities.tranq + '\n';

    output.addField('Ammo Capacity', ammoCapacity)
  } else {
    var coats = '';
    for (var i = 0; i < data.attributes.coatings.length; i++) {
      coats += data.attributes.coatings[i] + '\n';
    }
    output.addField('Coatings', coats, true)
  }

  // Display in footer, if weapon is craftable
  if (data.crafting.craftable == true) {
    var material = "Craft Material: "
    for (var i = 0; i < data.crafting.craftingMaterials.length; i++) {
      material +=
        data.crafting.craftingMaterials[i].quantity + ' ' +
        data.crafting.craftingMaterials[i].item.name;

      if (i != data.crafting.craftingMaterials.length - 1)
        material += ', '
    }
    output.setFooter(material);
  }

  message.channel.send(output);
}

/*******************************************************************************
 * Send message card of Armor Piece
 * @param {Message} message Message from Discord.Client
 * @param {Object} data Data recieved from the XHR
 */
function getPiece(message, data) {
  var bodyText =
    'Rarity: ' + data.rarity + '\n' +
    'Rank: ' + capitalize(data.rank) + '\n\n';

  // Defense Text
  var defense =
    'Base: ' + data.defense.base + '\n' +
    'Max: ' + data.defense.max + '\n' +
    'Augmented: ' + data.defense.augmented;

  // Resistance Text
  var resistance =
    'Fire: ' + data.resistances.fire + '\n' +
    'Water: ' + data.resistances.water + '\n' +
    'Ice: ' + data.resistances.ice + '\n' +
    'Lightning: ' + data.resistances.thunder + '\n' +
    'Dragon: ' + data.resistances.dragon + '\n';

  // Set message properties
  var output = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle(data.name)
    .setThumbnail(data.assets.imageMale)
    .setDescription(capitalize(data.type))
    .addField('Statistics', bodyText)
    .addField('Defense', defense, true)
    .addField('Resistance', resistance, true)

  // Check if there are any skills on armor
  if (data.skills.length > 0) {
    var skills = "";
    for (var i = 0; i < data.skills.length; i++) {
      skills +=
        data.skills[i].skillName +
        ' (Level ' + data.skills[i].level + ')\n' +
        '- ' + data.skills[i].description + '\n\n';
    } // End of for-loop
    output.addField('Skills', skills)
  } // End of if-statement


  // Display in footer, if weapon is craftable
  var material = "Craft Material: "
  for (var i = 0; i < data.crafting.materials.length; i++) {
    material +=
      data.crafting.materials[i].quantity + ' ' +
      data.crafting.materials[i].item.name;

    if (i != data.crafting.materials.length - 1)
      material += ', '
  }
  output.setFooter(material);

  message.channel.send(output);
}


/*******************************************************************************
 * Send message cards for each Armor Piece
 * @param {Message} message Message from Discord.Client
 * @param {Object} data Data recieved from XHR
 */
function getSet(message, data) {
  getPiece(message, data.pieces[0]);
  getPiece(message, data.pieces[1]);
  getPiece(message, data.pieces[2]);
  getPiece(message, data.pieces[3]);
  getPiece(message, data.pieces[4]);
}


/*******************************************************************************
 * Gets data from https://mhw-db.com/ based on command
 * @param {Array} command Array of a command and an argument
 * @returns {Object} Data found inside XHR, null if data cannot be found
 */
function getData(message, command) {
  var xhr = new XMLHttpRequest();
  var link = 'https://mhw-db.com/'

  // Switch to correct function for command
  switch (command[0]) {
    case '!armor':
      link += 'armor/sets'
      break;
    case '!weapon':
      link += 'weapons'
      break;
    case '!skill':
      link += 'skills'
      break;
    case '!item':
      link += 'items'
      break;
    case '!charm':
      link += 'charms'
      break;
    case '!decoration':
      link += 'decorations'
      break;
    default:
      console.log('Command does not exist');
      return null;

  } // End of Switch-Statement

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(xhr.responseText);

      for (var i = 0; i < data.length; i++) {
        if (data[i].name == command[1]) {
          // Switch to correct function for command
          switch (command[0]) {
            case '!armor':
              if (command.length > 2)
                getPiece(message, data[i].pieces[command[2]])
              else getSet(message, data[i])
              break;
            case '!weapon':
              getWeapon(message, data[i])
              break;
            case '!skill':
              getSkill(message, data[i])
              break;
            case '!item':
              getItem(message, data[i])
              break;
            case '!charm':
              getCharm(message, data[i]);
              break;
            case '!decoration':
              getDecoration(message, data[i])
              break;
            default:
              console.log('Command does not exist');
          } // End of Switch Statement
        } // End of if-Statment
      } // End of for Loop
    } // End of if-Statement
  } // End of onreadystatechange

  xhr.open('GET', link, true)
  xhr.send();
}


/*******************************************************************************
 * HELPER FUNCTIONS
 ******************************************************************************/

/**
 * Parses message into an array separated by spaces
 * @param {Message} message Message to be separated
 */
function parseMessage(message) {
  var m = message.content;
  var arr = [];

  // Split message into an array ['Command', 'Arguments...']
  m = m.split(' ');
  arr.push(m.shift());
  for (var i = 0; i < m.length; i++) {
    m[i] = capitalize(m[i])
  }
  arr.push(m.join(' '));

  // Check for Second Argument (Armor Piece)
  if (arr[1].indexOf(' Head') != -1) {
    arr.push(0);
    arr[1] = arr[1].replace(' Head', '')
  } else if (arr[1].indexOf(' Chest') != -1) {
    arr.push(1);
    arr[1] = arr[1].replace(' Chest', '')
  } else if (arr[1].indexOf(' Arms') != -1) {
    arr.push(2);
    arr[1] = arr[1].replace(' Arms', '')
  } else if (arr[1].indexOf('Waist') != -1) {
    arr.push(3);
    arr[1] = arr[1].replace(' Waist', '')
  } else if (arr[1].indexOf(' Legs') != -1) {
    arr.push(4);
    arr[1] = arr[1].replace(' Legs', '')
  }

  return arr;
}

/*******************************************************************************
 * Capitalizes first letter in text
 * @param {String} text Text to be capitalized
 */
function capitalize(text) {
  return text[0].toUpperCase() + text.substring(1);
}