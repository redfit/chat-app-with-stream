"use client";

import { useState } from "react";
import { Client, fql } from "fauna";

export default function MessageForm({ roomId, token }) {
  const [message, setMessage] = useState("");
  const client = new Client({
    secret: token,
  });
  const createMessage = async (e) => {
    e.preventDefault();
    await client.query(fql`
      Message.create({
        text: ${message},
        room: Room.byId(${roomId}),
      })
    `);
    setMessage("");
  };

  return (
    <form onSubmit={createMessage}>
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button type="submit">Send</button>
    </form>
  );
}
