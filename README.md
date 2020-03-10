# Social Post

Post a message from a GitHub Actions workflow run!

## Platforms:

### Enabled
- Discord

### Coming soon:
- Twitter

### More ? 
Vote [here](https://github.com/jsmrcaga/action-social-post/issues/1)!

## Usage

Example

```yml

name: 'Post Release to Discord'

on:
  release:
    types: ['published']

jobs:
  message_discord:
    name: 'Send a message to #general whenever I post a release'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: ./
        with:
          TWITTER_ENABLED: false
          DISCORD_ENABLED: true
          DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}

```

## Platform Specific

### Discord

To get your webhook you can go to your `Server Settings`, then under `Webhooks` you'll be prompted
to select a name, an avatar and you'll be given a webhook link that you can copy.

It should look like: `https://discordapp.com/api/webhooks/<server_id>/<token>` 

#### Overrides

Coming soon:
~You can override your bot name by using the input DISCORD_BOT_NAME~
~You can override your bot avatar by using the input DISCORD_BOT_AVATAR~

### Twitter

For Twitter you'll have to create an app. More info coming soon.
