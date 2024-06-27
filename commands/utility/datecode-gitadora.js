const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

let jsonPath = '../storage/datecodes.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('datecode-gitadora')
		.setDescription('Replies with Gitadora latest datecode'),
	async execute(interaction) {
		// Read the JSON file
		const jsonString = fs.readFileSync(jsonPath, 'utf-8');
		const jsonObject = JSON.parse(jsonString);
		await interaction.reply('Latest GITADORA Datecode: ' + jsonObject.GITADORA);
	},
};
