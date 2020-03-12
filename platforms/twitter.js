const fishingrod = require('fishingrod');

const Platform = require('./platform');

class Twitter extends Platform {
	constructor() {
		super('Twitter', [
			'TWITTER_CONSUMER_KEY',
			'TWITTER_CONSUMER_SECRET',
			'TWITTER_API_KEY',
			'TWITTER_API_SECRET'
		]);
	}

	enabled() {
		let enabled = this.input('TWITTER_ENABLED');
		if(enabled) {
			console.error('Twitter coming soon! Sorry!');
		}
		return false;
	}

	post() {
		// Should not be yet called
		throw new Error('Twitter is not yet available');
	}
}

let twitter = new Twitter();
module.exports = twitter;
