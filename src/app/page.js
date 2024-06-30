import styles from "./page.module.css";

import { Client, fql } from "fauna";
import RoomList from "@/app/components/RoomList";

export default async function Home() {
  const client = new Client({ secret: process.env.NEXT_PUBLIC_FAUNA_KEY });
  const roomsResponse = await client.query(fql`Room.all()`);
  const rooms = roomsResponse.data?.data
    ? roomsResponse.data.data.map((room) => ({ id: room.id, name: room.name }))
    : [];

  const createNewRoom = async (formData) => {
    "use server";
    const client = new Client({ secret: process.env.NEXT_PUBLIC_FAUNA_KEY });

    try {
      const roomName = formData.get("roomName");
      await client.query(fql`
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
        <form action={createNewRoom}>
          <input type="text" placeholder="Room name" name="roomName" />
          <button type="submit">Create room</button>
        </form>
      </div>
      <RoomList rooms={rooms} />
    </main>
  );
}
