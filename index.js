const OS = require('os');
const SocialMedia = require('./social-media');
const GitHub = require('./github');

let promises = SocialMedia.enabled_platforms().map(platform => platform.send());

Promise.all(promises).then(platforms => {
	if(!platforms || !platforms.length) {
		console.log('No platforms enabled');
	} else {
		console.log('Posted to ', platforms.map(p => p.name).join(', '), '!');
	}
	process.exit(0);
}).catch(e => {
	console.error(e);

	// Manually send error command to not import @actions/core
	GitHub.command('error', e.message);
	process.exit(1);
});
