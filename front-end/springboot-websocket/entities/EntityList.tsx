export interface Message {
  id: number;
  recipientId: number;
  senderId:number;
  content: string;
  timestamp?: Date;
  }
  
  export const initilier: Message[] = [
    {
      id: 0,
      senderId:0,
      recipientId: 0,
      content: "",
      timestamp: Date.now() as any
    },
  ];