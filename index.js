const OS = require('os');
const SocialMedia = require('./social-media');

let promises = SocialMedia.enabled_platforms().map(platform => platform.post());

Promise.all(promises).then(platforms => {
	console.log('Posted to ', platforms.map(p => p.name).join(', '), '!');
	process.exit(0);
}).catch(e => {
	console.error(e);

	// Manually send error command to not import @actions/core
	const error_message = '';
	error_message.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
	process.stdout.write(`::error::${error_message}${OS.EOL}`);

	process.exit(1);
});
