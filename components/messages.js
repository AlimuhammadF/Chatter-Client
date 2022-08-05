import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Messages({ setSelectedChat, selectedChat }) {
	// current session
	const { data: session } = useSession();

	const testmessages = [
		{
			_id: "1",
			sender: "62eac12546c33779013d0287",
			receiver: "zxies",
			message: "Y",
			chatId: "123",
		},
		{
			_id: "2",
			sender: "zxies",
			receiver: "62eac12546c33779013d0287",
			message:
				"Yooo how you doing o how are you my guy hope you fine. Your friend Zxies. o how are you my guy hope you fine. Your friend Zxies. o how are you my guy hope you fine. Your friend Zxies.",
			chatId: "123",
		},
		{
			_id: "3",
			sender: "62eac12546c33779013d0287",
			receiver: "zxies",
			message: "Yooo how you doing",
			chatId: "123",
		},
		{
			_id: "4",
			sender: "alimuhammad",
			receiver: "zxies",
			message: "Yooo how you doing",
			chatId: "1234",
		},
		{
			_id: "5",
			sender: "alimuhammad",
			receiver: "zxies",
			message: "Yooo how you doing",
			chatId: "12345",
		},
		{
			_id: "6",
			sender: "alimuhammad",
			receiver: "zxies",
			message: "Yooo how you doing",
			chatId: "12345",
		},
	];

	const [messages, setMessages] = useState([]);

	async function handleFetchMessages() {
		const allMessages = testmessages.filter(
			(x) => x.chatId === selectedChat._id
		);

		setMessages(allMessages);
	}

	useEffect(() => {
		handleFetchMessages();
	}, [selectedChat]);

	return (
		<div className="w-full h-full px-6 py-5 flex flex-col justify-end space-y-6">
			<div className="overflow-y-scroll no-scrollbar max-h-screen">
				{messages.map((msg) => (
					<div
						key={msg._id}
						className={`flex my-5 max-h-screen  ${
							msg.sender === session?.user?._id
								? "justify-end"
								: "justify-start"
						}`}
					>
						{msg.sender !== session?.user?._id && (
							<div
								className={`w-9 h-9 text-sm font-semibold cursor-pointer bg-gray-400 rounded-full flex justify-center text-main-white items-center`}
							>
								TE
							</div>
						)}
						<div className="px-4 flex flex-col justify-between">
							<div className="flex justify-between items-center">
								<h1 className="font-semibold opacity-70">
									{msg.sender === session?.user?._id
										? "You"
										: msg.sender}
								</h1>
								<h1 className="text-xs opacity-70">
									Today, 18:32
								</h1>
							</div>
							<p
								className={`${
									msg.sender === session?.user?._id
										? "bg-accent-blue text-main-white"
										: "bg-gray-300"
								} px-5 py-2 rounded-xl max-w-2xl`}
							>
								{msg.message}
							</p>
						</div>

						{msg.sender === session?.user?._id && (
							<div
								className={`w-9 h-9 text-sm font-semibold cursor-pointer bg-gradient-to-r from-cyan-500 to-accent-blue rounded-full flex justify-center text-main-white items-center`}
							>
								TE
							</div>
						)}
					</div>
				))}
			</div>
			<form className="border flex items-end border-opacity-30 border-main-black h-24 rounded-xl py-2 px-4">
				<textarea
					type="text"
					className="h-full w-full focus:outline-none bg-transparent  resize-none"
					placeholder="Enter you message"
				/>
				<button className="bg-accent-blue text-white text-semibold px-5 mb-1 py-1.5 rounded-xl">
					Send
				</button>
			</form>
		</div>
	);
}
