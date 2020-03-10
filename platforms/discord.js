const URL = require('url');
const fishingrod = require('fishingrod');

const Platform = require('./platform');

class Discord extends Platform {
	constructor() {
		super('Discord', [
			'DISCORD_WEBHOOK'
		]);
	}

	post() {
		let { host, path } = URL.parse(process.env[`INPUT_DISCORD_WEBHOOK`]);

		let message = this.get_message();
		console.log('[Discord] Posting message to discord:', message);
		return fishingrod.fish({
			method: 'POST',
			host,
			path,
			data: {
				username: process.env.DISCORD_BOT_NAME || 'Release Bot',
				content: message
			},
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(({ status, response }) => {
			if(status < 200 || status > 200) {
				console.error(`[Discord] (${status}) Response: `, response);
				throw new Error('DiscordAPIError');
			}

			console.log('[Discord] Posted successfully!');
			return this.get_response(response);
		}).catch(e => {
			console.error('[Discord] Error posting to Discord:', e);
			throw e;
		});
	}
}

let discord = new Discord();
module.exports = discord;
