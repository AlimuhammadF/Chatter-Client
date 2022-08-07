import { useSession } from "next-auth/react";

export default function Chat({ chat, setSelectedChat, selectedChat, socket }) {
	// current session
	const { data: session } = useSession();

	// handle select chat
	async function handleSelectChat() {
		if (selectedChat?._id !== chat._id) {
			// leave socket room first
			await socket.emit("leave-room", selectedChat?._id);

			await setSelectedChat({
				_id: chat._id,
				name: chat.name,
				lastestMessage: chat.lastestMessage,
				createAt: chat.createdAt,
			});
		}
	}

	return (
		<div
			onClick={handleSelectChat}
			className={`py-2.5 px-4 roun cursor-pointer ${
				selectedChat?._id === chat._id && "bg-gray-300"
			} hover:bg-gray-200 transition-all duration-300 border-b border-main-black border-opacity-20 select-none`}
		>
			{chat.members.map((data) => (
				<div key={data._id}>
					{data._id !== session?.user?._id ? (
						<>
							<div
								key={data._id}
								className="flex items-center space-x-2"
							>
								<div className="w-8 h-8 font-semibold cursor-pointer bg-gray-400 rounded-full flex justify-center text-main-white items-center">
									{data._id !== session?.user?._id
										? data.firstName[0] + data.lastName[0]
										: ""}
								</div>
								<h1 className="font-medium opacity-80">
									{data.firstName}
								</h1>
							</div>
							<p
								className={`text-sm ${
									chat?.latestMessage?.seen
										? "opacity-70"
										: "opacity-100 font-medium"
								} mt-2 truncate -translate-y-1`}
							>
								{chat?.latestMessage?.message
									? chat?.latestMessage?.message
									: "No latest Message.."}
							</p>
						</>
					) : (
						""
					)}
				</div>
			))}
		</div>
	);
}
