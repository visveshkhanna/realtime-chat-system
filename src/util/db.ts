interface Message {
  id: string;
  from: string;
  content: string;
}

interface User {
  id: string;
  username: string;
}

interface Chat {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
}

export const chats: Chat[] = [];
