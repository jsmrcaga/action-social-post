class GitHub {
	constructor() {

	}

	command(command, message) {
		message.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
		process.stdout.write(`::${command}::${message}${OS.EOL}`);
	}
}

const github = new GitHub();
module.exports = github;
