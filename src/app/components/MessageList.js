export default function MessageList({ messages }) {
  return (
    <div>
      {messages.data.map((message, index) => (
        <div key={index}>{message.text}</div>
      ))}
    </div>
  );
}
