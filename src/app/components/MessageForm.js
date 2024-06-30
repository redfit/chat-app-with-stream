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
      let user = Query.identity()
      Message.create({
        text: ${message},
        room: Room.byId(${roomId}),
        author: user,
        authorName: user.username
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
