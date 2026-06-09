export type RootStackParamList = {
  Pets: undefined
  Profile: undefined
  Matching: undefined
  MatchingDetail: {
    pet?: {
      id: string
      name?: string
    }
  }

  InviteInbox: undefined
  InviteSent: undefined

  ThreadList: undefined
  ThreadDetail: {
    threadId: string
  }
}