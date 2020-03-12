const URL = require('url');
const fishingrod = require('fishingrod');

const Platform = require('./platform');

class Discord extends Platform {
	constructor() {
		super('Discord', [
			'DISCORD_WEBHOOK'
		]);

	}

	get_default_template(message, variables) {
		return {
			username: this.input('DISCORD_BOT_NAME'),
			avatar_url: this.input('DISCORD_BOT_AVATAR'),
			content: message
		};
	}

	post() {
		let { host, path } = URL.parse(this.input('DISCORD_WEBHOOK'));

		let template = this.get_template();
		console.log('[Discord] Posting message to discord:', template);

		return fishingrod.fish({
			method: 'POST',
			host,
			path,
			data: template,
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(({ status, response }) => {
			if(status < 200 || status > 299) {
				console.error(`[Discord] (${status}) Response: `, response);
				throw new Error('DiscordAPIError');
			}

			console.log('[Discord] Posted successfully!');
			return response;
		}).catch(e => {
			console.error('[Discord] Error posting to Discord:', e);
			throw e;
		});
	}
}

let discord = new Discord();
module.exports = discord;
