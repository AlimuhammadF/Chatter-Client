export default function Chat({ chat, setSelectedChat, selectedChat }) {
	// handle select chat
	function handleSelectChat() {
		if (selectedChat?._id !== chat._id) {
			setSelectedChat({
				_id: chat._id,
				name: chat.name,
				lastestMessage: chat.lastestMessage,
				timestamps: chat.timestamps,
			});
		}
	}

	return (
		<div
			onClick={handleSelectChat}
			className="py-4 px-4 roun cursor-pointer hover:bg-gray-200 transition-all duration-300 border-b border-main-black border-opacity-20 select-none"
		>
			<div className="flex items-center space-x-2">
				<div className="w-8 h-8 font-semibold cursor-pointer bg-gray-400 rounded-full flex justify-center text-main-white items-center">
					{chat.name[0] + chat.name[1]}
				</div>
				<h1 className="font-medium opacity-80">{chat.name}</h1>
			</div>
			<p className="text-sm opacity-70 mt-2">{chat.lastestMessage}</p>
		</div>
	);
}
