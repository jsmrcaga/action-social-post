const fishingrod = require('fishingrod');

const Platform = require('./platform');

class Twitter extends Platform {
	constructor() {
		super('Twitter', [
			'TWITTER_ENABLED',
			'TWITTER_CONSUMER_KEY',
			'TWITTER_CONSUMER_SECRET',
			'TWITTER_API_KEY',
			'TWITTER_API_SECRET'
		]);
	}

	enabled() {
		console.error('Twitter coming soon! Sorry!');
		return false;
	}

	post() {
		// Should not be yet called
	}
}

let twitter = new Twitter();
module.exports = twitter;
