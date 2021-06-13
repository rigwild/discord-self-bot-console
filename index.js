var apiPrefix = 'https://discord.com/api/v9'

var delay = ms => new Promise(res => setTimeout(res, ms))

var apiCall = (apiPath, body, method = 'GET') => {
  if (!authHeader)
    throw new Error("The authorization token is missing. have you forgot set it? `authHeader = 'your_token'`")
  return fetch(`${apiPrefix}${apiPath}`, {
    body: body ? JSON.stringify(body) : undefined,
    method,
    headers: {
      Accept: '*/*',
      'Accept-Language': 'en-US',
      Authorization: authHeader,
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9002 Chrome/83.0.4103.122 Electron/9.3.5 Safari/537.36'
    }
  })
    .then(res => res.json().catch(() => {}))
    .catch(console.error)
}

var api = {
  // Get the last 100 messages from a channel
  getMessages(channelId) {
    return apiCall(`/channels/${channelId}/messages?limit=100`)
  },

  // Send a message in a channel
  sendMessage(channelId, message, tts) {
    return apiCall(`/channels/${channelId}/messages`, { content: message, tts: !!tts }, 'POST')
  },

  // Edit a message
  editMessage(channelId, messageId, newMessage) {
    return apiCall(`/channels/${channelId}/messages/${messageId}`, { content: newMessage }, 'PATCH')
  },

  // Delete a message from a channel
  deleteMessage(channelId, messageId) {
    return apiCall(`/channels/${channelId}/messages/${messageId}`, null, 'DELETE')
  },

  delay,
  apiCall
}

// Set your `Authorization` token here
var authHeader = ''
