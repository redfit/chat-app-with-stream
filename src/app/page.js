"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { Client, fql } from "fauna";
import Link from "next/link";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [existingRooms, setExistingRooms] = useState([]);

  const streamRef = useRef(null);
  const client = new Client({ secret: process.env.NEXT_PUBLIC_FAUNA_KEY });

  const fetchRooms = async () => {
    try {
      const response = await client.query(fql`
        Room.all()
      `);
      setExistingRooms(response.data.data);
      if (!streamRef.current) {
        const stream = await client.stream(fql`Room.all().toStream()`);
        streamRef.current = stream;
        for await (const event of stream) {
          switch (event.type) {
            case "add":
            case "update":
              setExistingRooms((prev) => {
                const existingRoom = prev.findIndex(
                  (room) => room.id === event?.data.id,
                );
                if (existingRoom === -1) {
                  return [...prev, event.data];
                } else {
                  return prev.map((room) => {
                    if (room.id === event?.data.id) {
                      return event.data;
                    }
                    return room;
                  });
                }
              });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!client) return;
    fetchRooms();
  }, []);

  const createNewRoom = async (e) => {
    e.preventDefault();
    try {
      const newroom = await client.query(fql`
        Room.create({
        name: ${roomName},
        })
      `);
    } catch (error) {
      console.log(error);
    }
  };

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
      <div>
        <h2>Existing rooms</h2>
        {existingRooms.map((room) => (
          <div key={room.id}>
            <Link href={`/rooms/${room.id}`}>{room.name}</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
