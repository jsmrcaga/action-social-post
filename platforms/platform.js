class Platform {
	constructor(name, required_inputs) {
		this.name = name;
		this.required_inputs = required_inputs;
	}

	post() {
		throw new Error('[Platform] post should be overridden');
	}

	get_response(response) {
		return {
			...this,
			response
		};
	}

	get_message() {
		let template = process.env[`INPUT_MESSAGE_TEMPLATE`] || '';
		let variables = {
			platform_name: this.name
		};

		for(let [k, v] of Object.entries(variables)) {
			let reg = new RegExp(`{{\\s?${k}\\s?}}`, 'gi');
			template = template.replace(reg, v);
		}

		return template;
	}

	enabled() {
		if(!process.env[`INPUT_${this.name.toUpperCase()}_ENABLED`]) {
			return false;
		}

		let { required_inputs } = this;
		let required_env = required_inputs.map(i => `INPUT_${i.toUpperCase()}`);

		let missing_env = [];
		for(let e of required_env) {
			if(!process.env[e]) {
				missing_env.push(e.replace('INPUT_', ''));
			}
		}

		if(missing_env.length) {
			console.error(`${this.name} enabled but missing parameters: `, missing_env.join(', '));
			return false;
		}

		return true;
	}
}

module.exports = Platform;
