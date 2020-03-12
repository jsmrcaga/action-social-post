const PLATFORMS = {
	discord: require('./platforms/discord'),
	twitter: require('./platforms/twitter'),
	slack: require('./platforms/slack'),
};

class SocialMedia {
	constructor() { }

	enabled_platforms() {
		return Object.values(PLATFORMS).filter(platform => platform.enabled());
	}
}

const social_media = new SocialMedia();

module.exports = social_media;
