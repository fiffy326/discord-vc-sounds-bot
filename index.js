const config = require('./config.json');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('The client is ready.');
});

client.on('voiceStateUpdate', async (oldState, newState) => {
	let user_id = newState.id;
	let audio_file_path = null;
	
	if ((oldState.channelID === null) && (newState.channelID !== null)) {
		for (var index = 1; index < config.users.length; index++) {
			if (config.users[index - 1].id === user_id) {
				audio_file_path = config.users[index - 1].audio_file_path;
				break;
			}
		}
		
		if (audio_file_path !== null) {
			const connection = await newState.channel.join();
			const dispatcher = connection.play(fs.createReadStream(audio_file_path));
			
			dispatcher.on('start', () => {
				let user_tag = newState.member.user.tag;
				let channel_name = newState.channel.name;
				let server_name = newState.channel.guild.name;
				console.log(`${user_tag} has joined '${channel_name}' in '${server_name}'.`);
				console.log(`'${audio_file_path}' is now playing.`);
			});
			
			dispatcher.on('finish', () => {
				console.log(`'${audio_file_path}' has finished playing.`);
				connection.disconnect();
			});
			
			dispatcher.on('error', console.error);
		}
	}
});

client.login(config.token);