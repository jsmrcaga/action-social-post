class Platform {
	constructor(name, required_inputs) {
		this.name = name;
		this.required_inputs = required_inputs;
	}

	post() {
		throw new Error('[Platform] post should be overridden');
	}

	input(name) {
		return process.env[`INPUT_${name.toUpperCase()}`];
	}

	get_response(response) {
		return {
			...this,
			response
		};
	}

	__get_variables() {
		let variables = {
			platform_name: this.name
		};

		return variables;
	}

	__template(template, variables) {
		for(let [k, v] of Object.entries(variables)) {
			let reg = new RegExp(`{{\\s?${k}\\s?}}`, 'gi');
			template = template.replace(reg, v);
		}
		return template;
	}

	get_default_template(message, variables) {
		return message;
	}

	get_template() {
		let template = this.input(`${this.name.toUpperCase()}_TEMPLATE`);
		let variables = this.__get_variables();
		let message = this.get_message();

		if(!template) {
			return this.get_default_template(message, variables);
		}

		template = this.__template(template, {...variables, message});
		return JSON.parse(template);
	}

	get_message() {
		let template = this.input(`MESSAGE_TEMPLATE`) || '';
		let variables = this.__get_variables();

		template = this.__template(template, variables);
		return template;
	}

	enabled() {
		if(!this.input(`${this.name.toUpperCase()}_ENABLED`)) {
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

	send() {
		let promise = this.post();
		if(promise && (promise instanceof Promise)) {
			return promise.then(response => this.get_response(response));
		}

		return Promise.resolve(this);
	}
}

module.exports = Platform;
