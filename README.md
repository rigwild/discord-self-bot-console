# Discord self-bot console

A simple Discord Self-bot using console. Intended for quick scripts runnable directly from the devtools.

# Disclaimer

Automating user accounts is against [Discord's Terms of Service](https://discord.com/terms). You might get banned if you abuse it (too much spam, unusual activity).

# Usage

1. Open Chrome devtools on Discord using `Ctrl + shift + i` and go to the console tab
1. Go to the console tab and paste the entire [`index.js`](./index.js) script
1. Go to the network tab and send a message in any channel/DM
1. A new entry should appear, click it then copy the `Authorization` header (in the `Request Headers` section)
1. Paste it in `authHeader` at the end of the script in the console
1. ...
1. Profit!

You can now use any function one by one as you like directly in the console `await api.someFunction()`. Don't forget `await` or the server's response will not be printed to the console.

```js
await api.sendMessage('channel_id', 'Hello!')
```

**Note:** It's a good idea to wrap your code in its own scope `{ code }` or you might get an error when reusing the same variable names later!

# Examples

## Basic example

Get the last 100 messages of a channel, send a message to it, edit it then delete it.

```js
{
  let channelId = '826934811846377545'

  // Send a message
  let sentMessage = await api.sendMessage(channelId, 'Hello!')

  await delay(3000)

  // Edit a message
  let editedMessage = await api.editMessage(channelId, sentMessage.id, 'Hello, edited!')

  await delay(3000)

  // Delete a message
  await api.deleteMessage(channelId, editedMessage.id)
}
```

## Farm XP

Send a `message` to a channel (`channelId`) every minute then delete it (useful for XP farming in some servers).

You can use `loop = false` at any time to stop it.

```js
{
  let channelId = '826934811846377545'
  let message = 'Hi, I like spamming 🦜'

  var loop = true
  let count = 0
  while (loop) {
    const message = await api.sendMessage(channelId, message)
    await api.deleteMessage(channelId, message.id)
    console.log(`Sent ${++count} messages`)
    await delay(61000) // 61 seconds
  }
}
```

## Clear messages of user

Delete the `amount` messages from user (`userId`) sent to a channel/DM (`channelId`) appearing before message (`beforeMessageId`) and wait `delayMs` milliseconds everytime.

I use sometimes to fully clear my DMs as Discord does not offer it as a feature.

You can use `loop = false` at any time to stop it.

Discord recently made its rate limiting strictier. I recommend 1100ms as a minimum to not get rate limited. Make it even bigger if you are affraid of getting banned.

(You can use https://github.com/rigwild/discord-purge-messages too!)

```js
{
  let channelId = '826934811846377545'
  let userId = '012345678987654321'
  let amount = 99999999
  let delayMs = 1100

  let beforeMessageId = '999999999999999999' // Leave it like this to delete from latest

  let deletionCount = 0
  var loop = true
  while (loop) {
    const messages = await api.getMessages(channelId, { before: beforeMessageId })

    // We reached the start of the conversation
    if (messages.length < 100 && messages.filter(x => x.author.id === userId && x.type === 0).length === 0) {
      loop = false
      console.log(`[${deletionCount}/${amount}] Reached the start of the conversations! Ending.`)
      continue
    }

    // Update last message snowflake for next iteration
    beforeMessageId = messages[0].id

    for (const aMessage of messages) {
      if (loop === false) break

      // Check if the max amount was reached
      if (deletionCount >= amount) {
        loop = false
        console.log(`[${deletionCount}/${amount}] Deleted the requested amount of messages! Ending.`)
        break
      }

      // Update last message snowflake for next iteration
      beforeMessageId = aMessage.id

      // Check if the message should be deleted
      if (aMessage.author.id === userId && aMessage.type === 0) {
        await api.deleteMessage(channelId, aMessage.id)
        deletionCount++
        console.log(`[${deletionCount}/${amount}] Deleted a message!`)
        if (deletionCount < amount) await delay(delayMs)
      }
    }
    await delay(delayMs)
  }
}
```

# API

## `delay(ms)`

`delay(ms: number) => Promise<void>`

Wait for `ms` milliseconds.

```js
await delay(1500)
```

## `api.getMessages(channelId)`

`api.getMessages(channelId: string) => Promise<Message[]>`

Get the last 100 messages from a channel (`channelId`).

https://discord.com/developers/docs/resources/channel#get-channel-messages

```js
await api.getMessages('826934811846377545')
```

```js
{
  let messages = await api.getMessages('826934811846377545')
  messages[0].author.username
}
```

## `api.sendMessage(channelId, message, tts)`

`api.sendMessage(channelId: string, message: string, tts = false) => Promise<Message>`

Send a `message` to a channel (`channelId`) with Text To Speach (`tts`, off by default).

https://discord.com/developers/docs/resources/channel#create-message

```js
await api.sendMessage('826934811846377545', 'Hello!')
await api.sendMessage('826934811846377545', 'Hello!', true)
```

```js
{
  let message = await api.sendMessage('826934811846377545', 'Hello!')
  message.id
}
```

## `api.editMessage(channelId, messageId, newMessage)`

`api.editMessage(channelId: string, messageId: string, newMessage: string) => Promise<Message>`

Edit a message (`messageId`) from a channel (`channelId`) and replace its content with `newMessage`.

https://discord.com/developers/docs/resources/channel#edit-message

```js
await api.editMessage('826934811846377545', '853663267628122122', 'Hello! You good? 😊')
```

```js
{
  let message = await api.editMessage('826934811846377545', '853663267628122122', 'Hello! You good? 😊')
  message.content
}
```

## `api.deleteMessage(channelId, messageId)`

`api.deleteMessage(channelId: string, messageId: string) => Promise<Message>`

Delete a message (`messageId`) from a channel (`channelId`).

https://discord.com/developers/docs/resources/channel#delete-message

```js
await api.deleteMessage('826934811846377545', '853663267628122122')
```

```js
{
  let messages = await api.deleteMessage('826934811846377545', '853663267628122122')
  messages[0]
}
```

## `api.apiCall(apiPath, body, method)`

`api.apiCall(apiPath: string, body: any, method = 'GET') => Promise<Message>`

Do a raw API call.

```js
await api.apiCall(`/channels/${channelId}/messages`, { content: message }, 'POST')
```

# FAQ

## Will I get banned if I do x?

I don't know, maybe. I have used lots of scripts in the past, often deleted 100k+ messages of mine accross private messages and servers and never got banned, ever.

But I can't guarantee anything. Use at your own risk.

Automating user accounts is againt [Discord's Terms of Service](https://discord.com/terms).

## Listen to events, do some advanced stuff

This is intended for small scripts, not to implement a full-featured bot.

If you need to listen to events or do something more advanced you can use the [discord.js](https://github.com/discordjs/discord.js) package with your user token (with v11.3.2 and below though, they deprecated user token support starting v11.4.0!).

**Note:** As they don't support user bots anymore, it may break at any time (with Discord changing their APIs).

## Can it do x? Can you help me?

Post your requests in the [Discussions](https://github.com/rigwild/discord-self-bot-console/discussions) tab. Please search if your request was not mentionned in an earlier post before asking.

## I made a nice/useful script, can I share?

Of course! Post the [Discussions](https://github.com/rigwild/discord-self-bot-console/discussions) tab. Please search if a similar script was shared earlier before posting.

## Why this repo?

Initially, this was posted as [a gist for myself](https://gist.github.com/rigwild/28f5d9479e3e122070e27db84e104719). As there's interest for such a thing, I figured out making a proper repo was better to share scripts.

# License

[The MIT License](./LICENSE)
