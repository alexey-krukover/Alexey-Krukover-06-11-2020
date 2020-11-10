// The Message Model
export class Message {
  id: number
  subject: string
  message: string
  sender: User
  receiver: User
  createdAt: Date
}

// The User Model
export class User {
  id: number
  username: string
}

// The Message Listing Enum
export enum MessageListingTypes {
  Inbox = 'inbox',
  Outbox = 'outbox'
}
