const fishingrod = require('fishingrod');

const Platform = require('./platform');

class Slack extends Platform {
	constructor() {
		super('Slack', [
			'SLACK_CHANNEL',
			'SLACK_OAUTH_TOKEN'
		]);
	}

	get_default_template(message, variables) {
		return {
			text: message,
			channel: this.input('SLACK_CHANNEL'),
			username: this.input('SLACK_BOT_NAME')
		}
	}

	post() {
		let template = this.get_template()
		console.log('[Slack] Posting message to Slack:', template);
		return fishingrod.fish({
			method: 'POST',
			host: 'slack.com',
			path: '/api/chat.postMessage',
			data: template,
			headers: {
				'Authorization': `Bearer ${this.input('SLACK_OAUTH_TOKEN')}`,
				'Content-Type': 'application/json'
			}
		}).then(({ status, response }) => {
			if(status < 200 || status > 299) {
				console.error(`[Slack] (${status}) Response: `, response);
				throw new Error('SlackAPIError');
			}

			console.log('[Slack] Posted successfully!');
			return response;
		}).catch(e => {
			console.error('[Slack] Error posting to Slack:', e);
			throw e;
		});
	}
}

let slack = new Slack();
module.exports = slack;
