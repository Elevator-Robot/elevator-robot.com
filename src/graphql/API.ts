export type SendMessageResponse = {
  success: boolean;
  message?: string | null;
  messageId?: string | null;
};

export type SendMessageMutation = {
  sendMessage?: SendMessageResponse | null;
};
