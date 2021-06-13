{
  const apiPrefix = 'https://discord.com/api/v9'

  var delay = ms => new Promise(res => setTimeout(res, ms))
  var qs = obj =>
    Object.entries(obj)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')

  const apiCall = (apiPath, body, method = 'GET') => {
    if (!authHeader)
      throw new Error("The authorization token is missing. Did you forget set it? `authHeader = 'your_token'`")
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
    /**
     * Get the last 100 messages from a channel
     * @see https://discord.com/developers/docs/resources/channel#get-channel-messages
     */
    getMessages(channelId, params = {}) {
      return apiCall(`/channels/${channelId}/messages?limit=100&${qs(params)}`)
    },

    /**
     * Send a message in a channel
     * @see https://discord.com/developers/docs/resources/channel#create-message
     */
    sendMessage(channelId, message, tts, body = {}) {
      return apiCall(`/channels/${channelId}/messages`, { content: message, tts: !!tts, ...body }, 'POST')
    },

    /**
     * Edit a message
     * @see https://discord.com/developers/docs/resources/channel#edit-message
     */
    editMessage(channelId, messageId, newMessage, body = {}) {
      return apiCall(`/channels/${channelId}/messages/${messageId}`, { content: newMessage, ...body }, 'PATCH')
    },

    /**
     * Delete a message from a channel
     * @see https://discord.com/developers/docs/resources/channel#delete-message
     */
    deleteMessage(channelId, messageId) {
      return apiCall(`/channels/${channelId}/messages/${messageId}`, null, 'DELETE')
    },

    delay,
    apiCall
  }

  // Set your `Authorization` token here
  var authHeader = ''
}
