/// <reference path="./index.js" />

export interface RequestOptions {
  method?: string
  headers?: { [key: string]: string }
  body?: any
}

export interface Message {
  id: string
  type: number
  content: string
  channel_id: string
  author: {
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
    flags: number
    banner: any
    accent_color: any
    global_name: string
    avatar_decoration: any
    banner_color: any
  }
  attachments: any[]
  embeds: any[]
  mentions: any[]
  mention_roles: any[]
  pinned: boolean
  mention_everyone: boolean
  tts: boolean
  timestamp: string
  edited_timestamp: any
  flags: number
  components: any[]
  nonce: string
  referenced_message: any
}

export interface Embed {
  title: string
  description: string
  // ...
}

export interface Thread {
  id: string
  name: string
  // ...
}

export interface Role {
  id: string
  name: string
  // ...
}

export interface Emoji {
  id: string
  name: string
  // ...
}

export interface User {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  flags: number
  banner: any
  accent_color: any
  global_name: string
  avatar_decoration: any
  banner_color: any
  mfa_enabled: boolean
  locale: string
  premium_type: number
  email: string
  verified: boolean
  phone: string
  nsfw_allowed: boolean
  linked_users: any[]
  bio: string
}

export interface Guild {
  id: string
  name: string
  // ...
}

export type api = {
  getMessages(channelOrThreadId: string, limit?: number, params?: any): Promise<Message[]>
  sendMessage(channelOrThreadId: string, message: string, tts?: boolean, body?: any): Promise<Message>
  replyToMessage(channelOrThreadId: string, repliedMessageId: string, message: string, tts: boolean, body?: any): Promise<Message>
  editMessage(channelOrThreadId: string, messageId: string, newMessage: string, body?: any): Promise<Message>
  deleteMessage(channelOrThreadId: string, messageId: string): Promise<any>

  createThread(channelId: string, toOpenThreadInmessageId: string, name: string, autoArchiveDuration?: number, body?: any): Promise<Thread>
  createThreadWithoutMessage(channelId: string, name: string, autoArchiveDuration?: number, body?: any): Promise<Thread>
  deleteThread(threadId: string): Promise<any>

  sendEmbed(channelOrThreadId: string, embed?: Embed): Promise<Message>

  getRoles(guildId: string): Promise<Role[]>
  createRole(guildId: string, name: string): Promise<Role>
  deleteRole(guildId: string, roleId: string): Promise<any>

  getBans(guildId: string): Promise<User[]>
  banUser(guildId: string, userId: string, reason: string): Promise<void>
  unbanUser(guildId: string, userId: string): Promise<void>
  kickUser(guildId: string, userId: string): Promise<void>

  addRole(guildId: string, userId: string, roleId: string): Promise<void>
  removeRole(guildId: string, userId: string, roleId: string): Promise<void>

  auditLogs(guildId: string): Promise<any>

  getChannels(guildId: string): Promise<any>
  createChannel(guildId: string, name: string, type: string): Promise<any>
  deleteChannel(channelId: string): Promise<void>
  getChannel(channelOrThreadId: string): Promise<any>

  pinnedMessages(channelId: string): Promise<Message[]>
  addPin(channelId: string, messageId: string): Promise<void>
  deletePin(channelId: string, messageId: string): Promise<void>

  listEmojis(guildId: string): Promise<Emoji[]>
  getEmoji(guildId: string, emojiId: string): Promise<Emoji>
  createEmoji(guildId: string, name: string, image: string, roles: string[]): Promise<Emoji>
  editEmoji(guildId: string, emojiId: string, name: string, roles: string[]): Promise<Emoji>
  deleteEmoji(guildId: string, emojiId: string): Promise<void>

  searchSlashCommand(channelOrThreadId: string, search: string): Promise<any>
  sendSlashCommand(guildId: string, channelOrThreadId: string, command: any, commandOptions?: any[]): Promise<any>

  changeNick(guildId: string, nick: string): Promise<void>
  leaveServer(guildId: string): Promise<void>

  getServers(): Promise<Guild[]>
  getGuilds(): Promise<Guild[]>
  listCurrentUserGuilds(): Promise<Guild[]>

  getDMs(): Promise<any>
  getUser(userId: string): Promise<User>

  getDirectFriendInviteLinks(): Promise<any>
  createDirectFriendInviteLink(): Promise<any>
  deleteDirectFriendInviteLinks(): Promise<any>

  getCurrentUser(): Promise<User>
  editCurrentUser(username?: string, bio?: string, body?: any): Promise<User>

  setCustomStatus(emojiId: string, emojiName: string, expiresAt: string, text: string): Promise<void>
  deleteCustomStatus(): Promise<void>

  listReactions(channelOrThreadId: string, messageId: string, emojiUrl: string): Promise<any>
  addReaction(channelOrThreadId: string, messageId: string, emojiUrl: string): Promise<void>
  deleteReaction(channelOrThreadId: string, messageId: string, emojiUrl: string): Promise<void>

  typing(channelOrThreadId: string): Promise<void>

  delay(ms: number): Promise<void>
  apiCall<T>(apiPath: string, body?: any, method?: string, options?: RequestOptions): Promise<T>
  id(log?: boolean): void
  update_guildId_and_channelId_withCurrentlyVisible(log?: boolean): void
  getConfig(): Readonly<{
    authHeader: string
    autoUpdateToken: boolean
    gid: string
    /** Alias for `gid` */
    guildId: string
    cid: string
    /** Alias for `cid` */
    channelId: string
  }>
  setConfigAuthHeader(token: string): void

  setConfigAutoUpdateToken: (autoUpdateToken: boolean) => void
  setConfigGid: (guildId: string) => void
  setConfigGuildId: (guildId: string) => void
  setConfigCid: (channelId: string) => void
  setConfigChannelId: (channelId: string) => void
}
