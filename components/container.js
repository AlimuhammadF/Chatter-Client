import { useState } from "react";
import Chats from "./chats";
import Messages from "./messages";

export default function Container({ socket }) {
	// selected chat
	const [selectedChat, setSelectedChat] = useState();
	const [chats, setChats] = useState([]);

	return (
		<div className="w-full h-screen rounded-2xl border-opacity-30 border border-main-black flex">
			<Chats
				selectedChat={selectedChat}
				setSelectedChat={setSelectedChat}
				socket={socket}
				setChats={setChats}
				chats={chats}
			/>
			{!selectedChat ? (
				<div className="flex text-xl w-full h-full items-center justify-center">
					Please Select a chat.
				</div>
			) : (
				<Messages
					selectedChat={selectedChat}
					setSelectedChat={setSelectedChat}
					socket={socket}
					setChats={setChats}
					chats={chats}
				/>
			)}
		</div>
	);
}
