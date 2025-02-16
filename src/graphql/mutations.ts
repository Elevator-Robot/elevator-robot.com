export const sendMessage = /* GraphQL */ `
  mutation SendMessage($name: String!, $email: String!, $message: String!) {
    sendMessage(name: $name, email: $email, message: $message)
  }
`;
