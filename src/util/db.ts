interface Message {
  id: string;
  from: string;
  content: string;
}

interface Chat {
  id: string;
  from: string;
  to: string | null;
  messages: Message[];
}

export const chats: Chat[] = [];
