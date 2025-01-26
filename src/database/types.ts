export interface Chat {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
}

export interface Message {
  id: string;
  from: string;
  content: string;
}

export interface User {
  id: string;
  username: string;
}
