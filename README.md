# Discord self-bot console

A simple Discord Self-bot using console.

# Usage

1. Open Chrome devtools on Discord using `Ctrl + shift + i` and go to the network tab
1. Send a message in any channel/DM
1. Go to the console tab and paste the entire [`index.js`](./index.js) script
1. A new entry should appear in the network tab, click it then copy the `Authorization` header (in the `Request Headers` section)
1. Paste it in `authHeader` at the end of the script
1. Now use the provided functions to do some stuff using `await api.someFunction()`

You can now use any function one by one as you like directly in the console. Don't forget `await` or the server's response will not be printed to the console.

```js
await api.sendMessage('channel_id', 'Hello!')
```

**Note:** It's a good idea to wrap your code in its own scope `{ code }` or you might get an error when reusing the same variable names later!

# API

### `delay(ms: number) => Promise`

Wait for `ms` milliseconds.

```js
await delay(1500)
```

### `api.getMessages(channelId: string) => Promise<Message[]>`

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

### `api.sendMessage(channelId: string, message: string, tts = false) => Promise<Message>`

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

### `api.editMessage(channelId: string, messageId: string, newMessage: string) => Promise<Message>`

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

### `api.deleteMessage(channelId: string, messageId) => Promise<Message>`

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

### `api.apiCall(apiPath: string, body: any, method = 'GET') => Promise<Message>`

Raw API call.

```js
await api.apiCall(`/channels/${channelId}/messages`, { content: message }, 'POST')
```

# Example

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

Send a message every minute then delete it (useful for XP farming in some servers). When you want to stop it you can simply use `loop = false`.

```js
{
  let channelId = '826934811846377545'
  let message = 'Hi, I like spamming 🦜'

  var loop = true
  let count = 0
  while (loop) {
    await api.sendMessage(channelId, message)
    console.log(`Sent ${++count} messages`)
    await delay(61000) // 61 seconds
  }
}
```

Delete the last `amount` messages from user (`userId`) sent to a channel/DM (`channelId`) and wait `deleteDelayMs` everytime.

(You can use https://github.com/rigwild/discord-purge-messages too!)

```js
{
  let channelId = '826934811846377545'
  let message = 'Hi, I like spamming 🦜'

  var loop = true
  let count = 0
  while (loop) {
    await api.sendMessage(channelId, message)
    console.log(`Sent ${++count} messages`)
    await delay(61000) // 61 seconds
  }
}
```

# License

[The MIT License](./LICENSE)
