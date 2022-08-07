import { useSession } from "next-auth/react";
import Image from "next/image";
import tickIcon from "../public/tick.svg";
import doubleTickIcon from "../public/doubletick.svg";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function Message({
	msg,
	socket,
	selectedChat,
	messages,
	setMessages,
	setChats,
	chats,
}) {
	// current session
	const { data: session } = useSession();

	// created date
	const date = new Date(msg.createdAt);

	// if in view
	const { ref, inView, entry } = useInView();

	// trigger a funtion wehn in view
	async function handleSeenMessage() {
		if (inView && !msg.seen && msg.sender._id !== session?.user?._id) {
			try {
				await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_LOCATION}/api/v1/chat/seenMessage`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							messageId: msg._id,
							seen: true,
						}),
					}
				);

				// seen data
				const seenData = {
					messageId: msg._id,
					seen: true,
					chatId: selectedChat._id,
				};

				await socket.emit("seen-message-send", seenData);
			} catch (error) {
				console.error(error);
			}
		}
	}

	// receive seen messaeg
	async function recSeenMessage() {
		await socket.on("seen-message-rec", async (data) => {
			const newState = await messages.map((e) => {
				if (e._id === data.messageId) {
					return { ...e, seen: true };
				}
				return e;
			});

			await setMessages(newState);
		});
	}

	useEffect(() => {
		recSeenMessage();
	}, [socket]);

	useEffect(() => {
		if (inView && !msg.seen && msg.sender._id !== session?.user?._id) {
			handleSeenMessage();
		}
	}, [inView]);

	// update latest msg on chat
	async function updateLatestMessage() {
		const tempChat = await chats.map((obj) => {
			if (obj._id === msg.chatId) {
				return {
					...obj,
					latestMessage: {
						_id: msg._id,
						seen: false,
						message: msg.message,
						chatId: selectedChat?._id,
						createdAt: msg.createdAt,
					},
				};
			}
			return obj;
		});

		const finalChat = tempChat.sort((obj1, obj2) => {
			const obj3 = new Date(obj1?.latestMessage?.createdAt);
			const obj4 = new Date(obj2?.latestMessage?.createdAt);
			return obj4 - obj3;
		});

		await setChats(finalChat);
	}
	useEffect(() => {
		updateLatestMessage();
	}, []);

	return (
		<div
			ref={ref}
			className={`flex mt-5 max-h-screen  ${
				msg.sender._id === session?.user?._id
					? "justify-end"
					: "justify-start"
			}`}
		>
			{msg.sender._id !== session?.user?._id && (
				<div
					className={`w-9 h-9 text-sm font-semibold cursor-pointer bg-gray-400 rounded-full flex justify-center text-main-white items-center`}
				>
					{msg.sender.firstName[0] + msg.sender.lastName[0]}
				</div>
			)}
			<div className="px-4 flex flex-col justify-between">
				<h1
					className={`font-semibold opacity-70 ${
						msg.sender._id === session?.user?._id
							? " justify-end"
							: "justify-start"
					} flex w-full`}
				>
					{msg.sender._id === session?.user?._id
						? "You"
						: msg.sender.firstName}
				</h1>

				<div
					className={`${
						msg.sender._id === session?.user?._id
							? "bg-accent-blue text-main-white"
							: "bg-gray-300"
					} px-5 py-2 rounded-xl max-w-2xl`}
				>
					<p>{msg.message}</p>

					<div className="flex items-center space-x-3 justify-between mt-1.5">
						<p className="text-xs opacity-70 flex justify-end mt-2">
							{format(date, "eeee, p")}
						</p>
						{msg.sender._id === session?.user?._id && (
							<div>
								{!msg.seen ? (
									<div>
										<Image
											src={tickIcon}
											height="10px"
											width="12px"
											objectFit="cover"
											alt="sent"
										/>
									</div>
								) : (
									<div>
										<Image
											src={doubleTickIcon}
											height="10px"
											width="16px"
											objectFit="cover"
											alt="seen"
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{msg.sender._id === session?.user?._id && (
				<div
					className={`w-9 h-9 text-sm font-semibold cursor-pointer bg-gradient-to-r from-cyan-500 to-accent-blue rounded-full flex justify-center text-main-white items-center`}
				>
					{msg.sender.firstName[0] + msg.sender.lastName[0]}
				</div>
			)}
		</div>
	);
}
