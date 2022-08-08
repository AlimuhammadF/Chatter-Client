import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Message from "./message";
import typingLottie from "../public/typing.json";
import Lottie from "lottie-react";

export default function Messages({ selectedChat, socket, setChats, chats }) {
	// current session
	const { data: session } = useSession();

	// fetch all messages
	const [messages, setMessages] = useState([]);
	const [fetchMessageLoading, setFetchMessagesLoading] = useState(true);
	async function handleFetchMessages() {
		setFetchMessagesLoading(true);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_LOCATION}/api/v1/chat/fetchMessages?chatid=${selectedChat._id}`,
				{
					method: "GET",
				}
			).then(async (res) => {
				return await res.json();
			});

			if (response.success) {
				setMessages(response.result);
				setFetchMessagesLoading(false);

				// connect to chat room
				await socket.emit("join-room", selectedChat?._id);
				return;
			}

			if (response.error) {
				console.error(response.error);
				setFetchMessagesLoading(false);
				return;
			}
		} catch (error) {
			console.error(response);
			setFetchMessagesLoading(false);
		}
	}

	useEffect(() => {
		handleFetchMessages();
	}, [selectedChat]);

	// send message
	const [messageInput, setMessageInput] = useState("");
	const [sendingMessageLoading, setSendingMessageLoading] = useState(false);
	async function handleSendMessage(e) {
		e.preventDefault();

		setSendingMessageLoading(true);

		try {
			// message send api
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_LOCATION}/api/v1/chat/sendMessage`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						sender: session?.user?._id,
						message: messageInput,
						chatId: selectedChat._id,
					}),
				}
			).then(async (res) => {
				return await res.json();
			});

			// if error
			if (response.error) {
				setFetchMessagesLoading(false);
				console.error(response.message);
				return;
			}

			// if success
			if (response.success) {
				setMessageInput("");

				// update client side
				const messageData = {
					_id: response.result._id,
					sender: {
						_id: session?.user?._id,
						firstName: session?.user?.firstName,
						lastName: session?.user?.lastName,
					},
					seen: false,
					message: messageInput,
					chatId: selectedChat?._id,
					createdAt: new Date(),
				};
				setMessages((list) => [...list, messageData]);

				// send message in socket
				await socket.emit("send-message", messageData);

				setSendingMessageLoading(false);
			}
		} catch (error) {
			toast.error("Something went wrong.");
			setFetchMessagesLoading(false);
			console.error(error);
		}
	}

	// when typing
	const [typing, setTyping] = useState(false);
	async function handleTyping() {
		const typingData = {
			chatId: selectedChat?._id,
			typing: messageInput ? true : false,
		};

		await socket.emit("typing-send", typingData);
	}
	useEffect(() => {
		handleTyping();
	}, [messageInput]);

	// when typing rec
	async function handleRecTyping() {
		await socket.on("typing-rec", (data) => {
			setTyping(data.typing);
		});
	}
	useEffect(() => {
		handleRecTyping();
	}, [socket]);

	// receive messages
	async function handleReciveMessage() {
		await socket.on("rec-message", async (data) => {
			setMessages((messsages) => [...messsages, data]);
		});
		console.log(messages);
	}
	useEffect(() => {
		handleReciveMessage();
	}, [socket]);

	// scroll to bottom
	const messagesRef = useRef(null);
	const scrollToBottom = () => {
		messagesRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "start",
		});
	};
	useEffect(() => {
		scrollToBottom();
	}, [messages, fetchMessageLoading, typing]);

	return (
		<>
			{fetchMessageLoading ? (
				<div className="w-full h-full flex justify-center items-center">
					<div role="status">
						<svg
							aria-hidden="true"
							className="mr-2 w-8 h-8 text-gray-300 animate-spin fill-main-black"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			) : (
				<>
					<div className="w-full h-full px-6 py-5 flex flex-col justify-end space-y-6">
						<div className="overflow-y-scroll no-scrollbar max-h-screen">
							{messages.map((msg) => (
								<Message
									key={msg?._id || "123"}
									msg={msg}
									socket={socket}
									setMessages={setMessages}
									messages={messages}
									setChats={setChats}
									chats={chats}
									selectedChat={selectedChat}
								/>
							))}
							{sendingMessageLoading && (
								<p className="flex justify-end font-medium text-sm opacity-70 mt-1 -translate-x-12">
									Sending...
								</p>
							)}
							{typing && (
								<div className="w-14 rounded-xl translate-x-12 bg-gray-200 h-8 flex justify-center items-center mt-5">
									{
										<Lottie
											animationData={typingLottie}
											loop={true}
										/>
									}
								</div>
							)}
							<div ref={messagesRef}></div>
						</div>

						<form
							onSubmit={handleSendMessage}
							className="border flex items-end border-opacity-30 border-main-black h-24 rounded-xl py-2 px-4"
						>
							<textarea
								type="text"
								className="h-full w-full focus:outline-none bg-transparent  resize-none"
								placeholder="Enter you message"
								required
								onChange={(e) =>
									setMessageInput(e.target.value)
								}
								value={messageInput}
							/>
							<button className="bg-accent-blue text-white text-semibold px-5 mb-1 py-1.5 rounded-xl">
								Send
							</button>
						</form>
					</div>
				</>
			)}
		</>
	);
}
