# Social Post

Post a message from a GitHub Actions workflow run!

## Platforms:

### Enabled
- Discord
- Slack

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
      - uses: jsmrcaga/action-social-post@latest
        with:
          MESSAGE_TEMPLATE: 'Hello {{ platform_name }}!'

          TWITTER_ENABLED: false

          # Discord
          DISCORD_ENABLED: true
          DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}

          # Slack
          SLACK_ENABLED: true
          SLACK_OAUTH_TOKEN: ${{ secrets.SLACK_OAUTH_TOKEN }}
          SLACK_TEMPLATE: '{"attachments":[{"text":"{{ message }}","pretext":"${{ github.ref }}"}],"blocks":[{"type":"section","text":{"type":"plain_text","text":"Block 1"}}],"channel":"#general"}'

```

## Templates

If you want to send specific messages to specific platforms, you can do so by speicifying a `{PLATFORM}_TEMPLATE` environment
variable. This will be templated with the action's values and then JSON-parsed to send to the messaging platform.

Note that many platforms require specific fields and this action will not check their presence, so be careful when overriding and
read the docs! 

> **Be sure to stringify your JSON!**

* Discord: https://discordapp.com/developers/docs/resources/webhook#execute-webhook
* Slack: https://api.slack.com/methods/chat.postMessage#channels

### Action specific variables

In order to add these variables to your message (`MESSAGE_TEMPLATE`) or your template (`{PLATFORM}_TEMPLATE`) please add them between double curly-braces:
```
This is my platform's name {{ platform_name }}!
```

| Name | Type | Description |
|:----:|:----:|:-----------:|
| `message` | string | The generated message, defaults to `'I published a new release to {{ platform_name }}: v${{ github.ref }}!'` |
| `platform_name` | string | The name of the current platform (example: `Discord` or `Slack`) |

> Remember that you can use GitHub templating beforehand, like `v${{ github.ref }}!'` to get `vrefs/tags/v0.0.2!`

## Platform Specific

### Discord

To get your webhook you can go to your `Server Settings`, then under `Webhooks` you'll be prompted
to select a name, an avatar and you'll be given a webhook link that you can copy.

It should look like: `https://discordapp.com/api/webhooks/<server_id>/<token>` 

#### Inputs

| Name | Required | Description |
|:----:|:--------:|:-----------:|
| `DISCORD_WEBHOOK` | true | The webhook this action will use to send messages |
| `DISCORD_BOT_NAME` | false | An override for the name displayed by the bot |
| `DISCORD_BOT_AVATAR` | false | A URL overriding the bot's avatar |

#### Overrides

* You can override your bot name by using the input DISCORD_BOT_NAME
* You can override your bot avatar by using the input DISCORD_BOT_AVATAR

#### Templating

> For more information regarding the API please take a [look here](https://discordapp.com/developers/docs/resources/webhook#execute-webhook)

* You can add `embeds` (result of some checks for example)
* You can add a `file` (maybe an artifact from a previous action)

### Slack

In order to get your token you'll need to create an app here: https://api.slack.com/apps

Once you created your app, install it on your workspace and copy the `Bot User OAuth Access Token
` from [the OAuth page](https://api.slack.com/apps/ABYQYUCF5/oauth?)

#### Inputs

| Name | Required | Description |
|:----:|:--------:|:-----------:|
| `SLACK_OAUTH_TOKEN` | true | The bot token used to authorize the action to send messages |
| `SLACK_CHANNEL` | true | The channel the action should send the message to (example: `#general`, for a user IM you'll need the channel id) |
| `SLACK_BOT_NAME` | false | A string to override the bot's name |


### Overrides

* You can override the bot's name

### Templating

> For more information regarding the API please take a [look here](https://api.slack.com/methods/chat.postMessage)

* You can add `attachments`
* You can add `blocks`

Example:
```json
{"attachments":[{"text":"Attachment1","pretext":"Pre-Attachment1"}],"blocks":[{"type":"section","text":{"type":"plain_text","text":"Block 1"}}],"channel":"#general"}
```

### Twitter

For Twitter you'll have to create an app. More info coming as soon as we enable twitter.

# Changelog

## v1.0.0
* Discord enabled

## v1.1.1
* Slack enabled
* Templating enabled
