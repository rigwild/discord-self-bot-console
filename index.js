{
  var delay = ms => new Promise(res => setTimeout(res, ms))
  // prettier-ignore
  var qs = obj => Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('&')

  const xSuperPropertiesObj = {
    os: 'Windows',
    browser: 'Discord Client',
    release_channel: 'stable',
    client_version: '1.0.9005',
    os_version: '10.0.22000',
    os_arch: 'x64',
    system_locale: 'en-US',
    client_build_number: 133852,
    client_event_source: null
  }

  const apiCall = (apiPath, body, method = 'GET') => {
    if (!authHeader) throw new Error("The authorization token is missing. Did you forget to set it? `authHeader = 'your_token'`")
    return fetch(`https://discord.com/api/v9${apiPath}`, {
      body: body ? JSON.stringify(body) : undefined,
      method,
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US',
        Authorization: authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9005 Chrome/91.0.4472.164 Electron/13.6.6 Safari/537.36',
        'S-Super-Properties': btoa(JSON.stringify(xSuperPropertiesObj))
      }
    })
      .then(res => res.json().catch(() => {}))
      .catch(console.error)
  }

  var api = {
    getMessages: (channelId, params = {}) => apiCall(`/channels/${channelId}/messages?limit=100&${qs(params)}`),
    sendMessage: (channelId, message, tts, body = {}) => apiCall(`/channels/${channelId}/messages`, { content: message, tts: !!tts, ...body }, 'POST'),
    editMessage: (channelId, messageId, newMessage, body = {}) => apiCall(`/channels/${channelId}/messages/${messageId}`, { content: newMessage, ...body }, 'PATCH'),
    deleteMessage: (channelId, messageId) => apiCall(`/channels/${channelId}/messages/${messageId}`, null, 'DELETE'),

    // Use this generator: https://discord.club/dashboard
    // Click `+` at the bottom in the embed section then copy the `embed` key in the JSON output.
    sendEmbed: (channelId, embed = { title: 'Title', description: 'Description' }) => apiCall(`/channels/${channelId}/messages`, { embed }, 'POST'),

    auditLog: guildId => apiCall(`/guilds/${guildId}/audit-logs`),

    getRoles: guildId => apiCall(`/guilds/${guildId}/roles`),
    createRole: (guildId, name) => apiCall(`/guilds/${guildId}/roles`, { name }, 'POST'),
    deleteRole: (guildId, roleId) => apiCall(`/guilds/${guildId}/roles/${roleId}`, null, 'DELETE'),

    getBans: guildId => apiCall(`/guilds/${guildId}/bans`),
    banUser: (guildId, userId, reason) => apiCall(`/guilds/${guildId}/bans/${userId}`, { delete_message_days: '7', reason }, 'PUT'),
    unbanUser: (guildId, userId) => apiCall(`/guilds/${guildId}/bans/${userId}`, null, 'DELETE'),
    kickUser: (guildId, userId) => apiCall(`/guilds/${guildId}/members/${userId}`, null, 'DELETE'),

    addRole: (guildId, userId, roleId) => apiCall(`/guilds/${guildId}/members/${userId}/roles/${roleId}`, null, 'PUT'),
    removeRole: (guildId, userId, roleId) => apiCall(`/guilds/${guildId}/members/${userId}/roles/${roleId}`, null, 'DELETE'),

    getChannels: guildId => apiCall(`/guilds/${guildId}/channels`),
    createChannel: (guildId, name, type) => apiCall(`/guilds/${guildId}/channels`, { name, type }, 'POST'),

    pinnedMessages: channelId => apiCall(`/channels/${channelId}/pins`),
    addPin: (channelId, messageId) => apiCall(`/channels/${channelId}/pins/${messageId}`, null, 'PUT'),
    deletePin: (channelId, messageId) => apiCall(`/channels/${channelId}/pins/${messageId}`, null, 'DELETE'),

    listEmojis: guildId => apiCall(`/guilds/${guildId}/emojis`),
    getEmoji: (guildId, emojiId) => apiCall(`/guilds/${guildId}/emojis/${emojiId}`),
    createEmoji: (guildId, name, image, roles) => apiCall(`/guilds/${guildId}`, { name, image, roles }, 'POST'),
    editEmoji: (guildId, emojiId, name, roles) => apiCall(`/guilds/${guildId}/${emojiId}`, { name, roles }, 'PATCH'),
    deleteEmoji: (guildId, emojiId) => apiCall(`/guilds/${guildId}/${emojiId}`, null, 'DELETE'),

    changeNick: (guildId, nick) => apiCall(`/guilds/${guildId}/members/@me/nick`, { nick }, 'PATCH'),
    leaveServer: guildId => apiCall(`/users/@me/guilds/${guildId}`, null, 'DELETE'),

    getDMs: () => apiCall(`/users/@me/channels`),
    getUser: userId => apiCall(`/users/${userId}`),

    getCurrentUser: () => apiCall('/users/@me'),
    editCurrentUser: (username, avatar) => apiCall('/users/@me', { username, avatar }, 'PATCH'),
    listCurrentUserGuilds: () => apiCall('/users/@me/guilds'),

    listReactions: (channelId, messageId, emojiUrl) => apiCall(`/channels/${channelId}/messages/${messageId}/reactions/${emojiUrl}/@me`),
    addReaction: (channelId, messageId, emojiUrl) => apiCall(`/channels/${channelId}/messages/${messageId}/reactions/${emojiUrl}/@me`, null, 'PUT'),
    deleteReaction: (channelId, messageId, emojiUrl) => apiCall(`/channels/${channelId}/messages/${messageId}/reactions/${emojiUrl}/@me`, null, 'DELETE'),

    typing: channelId => apiCall(`/channels/${channelId}/typing`, null, 'POST'),

    delay,
    apiCall
  }

  console.log('\n\n\n\nSelfbot loaded! Use it like this: `await api.someFunction()`')
  console.log('Abusing this could get you banned from Discord, use at your own risk!')
  console.log()
  console.log(
    'This script does **not** work with bot accounts! ' +
      'If you have a bot account, use Node.js (or a proper lib like discord.js!) with the modified script ' +
      'https://github.com/rigwild/discord-self-bot-console/discussions/4#discussioncomment-1438231'
  )
  console.log()
  console.log('Use the `id()` function to update the variable `gid` guild id and `cid` channel id to what you are currently watching.')
  console.log('https://github.com/rigwild/discord-self-bot-console')

  var gid = '' // Current guild id
  var cid = '' // Current channel id

  // Call this to update `cid` and `gid` to current channel and guild id
  var id = (log = true) => {
    gid = window.location.href.split('/').slice(4)[0]
    cid = window.location.href.split('/').slice(4)[1]
    if (log) {
      console.log(`\`gid\` was set to the guild id you are currently looking at (${gid})`)
      console.log(`\`cid\` was set to the channel id you are currently looking at (${cid})`)
    }
  }
  id(false)

  var authHeader = ''
  var autoUpdateToken = true

  if (!XMLHttpRequest_setRequestHeader) {
    var XMLHttpRequest_setRequestHeader = XMLHttpRequest.prototype.setRequestHeader
  }
  // Auto update the authHeader when a request with the token is intercepted
  XMLHttpRequest.prototype.setRequestHeader = function () {
    if (autoUpdateToken && arguments[0] === 'Authorization' && authHeader !== arguments[1]) {
      authHeader = arguments[1]
      console.log('Updated the Auth token!', authHeader)
    }
    XMLHttpRequest_setRequestHeader.apply(this, arguments)
  }
}
