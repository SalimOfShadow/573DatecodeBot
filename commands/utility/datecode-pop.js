const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

let jsonPath = '../storage/datecodes.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('datecode-pop')
		.setDescription('Replies with M39 latest datecode'),
	async execute(interaction) {
		// Read the JSON file
		const jsonString = fs.readFileSync(jsonPath, 'utf-8');
		const jsonObject = JSON.parse(jsonString);
		await interaction.reply("Latest Pop'n Music Datecode: " + jsonObject.POP);
	},
};
