export type ThemeMode = "light" | "dark" | "system";

export type User = {
  id: string;
  userName: string;
  email: string;
  profileUrl?: string;
  role?: string;
  createdAt?: any;
  connections?: Connection[];
};

export type ConnectionStatus = "pending" | "accepted" | "declined";
export type ConnectionDirection = "incoming" | "outgoing";

export type Connection = {
  uid: string; // other user's uid
  status: ConnectionStatus;
  direction: ConnectionDirection;
};

export type Chat = {
  id: string;
  participants: string[]; // two UIDs
  createdAt: any;
  lastMessage?: Message;
};

export type Message = {
  id: string;
  chatId?: string;
  text?: string;
  senderId: string;
  createdAt: any;
  mediaUrl?: string;
  mediaType?: string;
};
