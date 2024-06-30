import styles from "../../page.module.css";
import { Client, fql } from "fauna";
import MessageForm from "@/app/components/MessageForm";
import MessageList from "@/app/components/MessageList";

export default async function Room({ params }) {
  const client = new Client({
    secret: process.env.NEXT_PUBLIC_FAUNA_KEY,
  });

  console.log(params);
  const response = await client.query(fql`
    let room = Room.byId(${params.id[0]})
    let messages = Message.where(.room == room)
    {
      name: room.name,
      messages: messages
    }
  `);

  const messages = response.data.messages.data.map((message) => ({
    text: message.text,
    id: message.id,
  }));

  return (
    <div className={styles.main}>
      <div>Welcome, {response.data.name}</div>
      <MessageList messages={messages} roomId={params.id[0]} />
      <MessageForm roomId={params.id[0]} />
    </div>
  );
}
