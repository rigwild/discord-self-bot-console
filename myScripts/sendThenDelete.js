// @ts-check
const { api } = require('../index.js')

// Copy paste the below code inside the Discord console
;(async () => {
  const user = await api.getCurrentUser()

  api.update_guildId_and_channelId_withCurrentlyVisible()
  let channelId = api.getConfig().channelId

  // Send a message
  let sentMessage = await api.sendMessage(channelId, `Hello! 👋 My name is ${user.username}!`)

  await api.delay(2000)

  // Edit a message
  let editedMessage = await api.editMessage(channelId, sentMessage.id, 'Hello, edited! ✌️')

  await api.delay(2000)

  // Delete a message
  await api.deleteMessage(channelId, editedMessage.id)

  await api.delay(2000)

  // Log the last 100 messages in the console
  let messages = await api.getMessages(channelId)
  console.log(messages)
})()
