//Setting URL paramaters
const fs = require('fs');
const { JSDOM } = require('jsdom');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../keys/.env') });

const jsonPath = './datecodes.json'; // Update the path to absolute if throws an error

const DDRURL = 'https://bemaniwiki.com/?DanceDanceRevolution+A3';
const SDVXURL = 'https://bemaniwiki.com/?SOUND+VOLTEX+EXCEED+GEAR';
const IIDXURL = 'https://bemaniwiki.com/?beatmania+IIDX+31+EPOLIS';
const POPURL = 'https://bemaniwiki.com/?pop%27n+music+UniLab';
const GITADORAURL = 'https://bemaniwiki.com/?GITADORA+FUZZ-UP';

client.login(process.env.DISCORD_TOKEN);
function setJson(game, newVersion) {
	// Read the JSON file
	const jsonString = fs.readFileSync(jsonPath, 'utf-8');
	const jsonObject = JSON.parse(jsonString);
	// Modify specific fields
	const currentGameVersion = jsonObject[game];
	if (newVersion != currentGameVersion) {
		jsonObject[game] = newVersion;
		// Convert the JavaScript object back to a JSON string
		const updatedJsonString = JSON.stringify(jsonObject, null, 2);
		// Write the updated JSON back to the file
		fs.writeFileSync(jsonPath, updatedJsonString, 'utf-8');
		console.log(
			game +
				' version updated      -      ' +
				currentGameVersion +
				' -> ' +
				newVersion
		);
		// Alert the user
		sendMessage(game, currentGameVersion);
	} else {
		console.log('No changes yet'); // If no changes were found
	}
}

async function fetchSingleGame(url) {
	try {
		const response = await fetch(url);
		const data = await response.text();
		const { window } = new JSDOM(data);
		const $ = require('jquery')(window);
		const content = $(
			'body > div#contents > div#body > ul.list1.list-indent1 > li > strong' // Wanted string's DOM tree
		);
		content.each((index, element) => {
			const prefix = $(element).text().substring(0, 3);
			const stringContent = $(element).html();

			switch (prefix) {
				case 'KFC':
					if (stringContent.includes(':r:G:A:')) {
						newVersion = stringContent.replace(':r:G:A:', '-');
						setJson('SDVX', newVersion);
					}
					break;
				case 'LDJ':
					newVersion = stringContent.replace(':x:y:A:', '-');
					setJson('IIDX', newVersion);
					break;
				case 'M39':
					newVersion = stringContent.replace(':J:*:A:', '-');
					setJson('POP', newVersion);
					break;
				case 'MDX':
					newVersion = stringContent.replace(':x:y:z:', '-');
					setJson('DDR', newVersion);
					break;
				case 'M32':
					newVersion = stringContent.replace(':J:x:A:', '-');
					setJson('GITADORA', newVersion);
					break;
				default:
				// console.warn("no datecode found");
			}
		});
	} catch (error) {
		console.error(error);
	}
}

function fetchDatecode() {
	const urlsArray = [DDRURL, SDVXURL, IIDXURL, POPURL, GITADORAURL];
	for (const url of urlsArray) {
		fetchSingleGame(url);
	}
}

function updateDatecode() {
	console.log('Next Fetch in 30 mins...');
	setInterval(() => {
		fetchDatecode();
	}, 30 * 60 * 1000);
}

function sendMessage(game, currentGameVersion) {
	const adminRoleId = process.env.ADMIN_ROLE_ID;

	function alert() {
		if (newVersion.substring(4) <= currentGameVersion.substring(4)) {
			//if the datecode reverts back to an older one,don't alert
			return;
		}
		// we could use abastraction in the future to optimize this
		client.channels.fetch(process.env.CHANNEL_ID).then((channel) => {
			channel.send(`<@&${adminRoleId}> ${game} got updated!!
			- ${currentGameVersion}  --->    ${newVersion}`);
		});
	}

	if (game === 'SDVX' || game === 'IIDX') {
		alert();
	} else {
		client.channels.fetch(process.env.CHANNEL_ID).then((channel) => {
			channel.send(
				`${game} got updated!! - ${currentGameVersion} -> ${newVersion}`
			);
		});
	}
}

module.exports = updateDatecode;
