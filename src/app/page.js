"use client";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [roomName, setRoomName] = useState("");

  const createNewRoom = async (e) => {};

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <form onSubmit={createNewRoom}>
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button type="submit">Create room</button>
        </form>
      </div>
    </main>
  );
}
