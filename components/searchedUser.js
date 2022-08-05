import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function SearchedUser({
	data,
	setSelectedChat,
	selectedChat,
	setCreateChat,
	setSearch,
}) {
	// current session
	const { data: session } = useSession();

	// handle create chat
	async function handleCreateChat() {
		// create toast
		const createChatToast = toast.loading("Creating chat...");

		try {
			// create chat api
			const fetchCreateChatApi = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_LOCATION}/api/v1/chat/createChat`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						receiverId: data._id,
						senderId: session?.user?._id,
					}),
				}
			).then((res) => {
				return res.json();
			});

			await setCreateChat(false);
			await setSearch([]);

			// if success
			if (fetchCreateChatApi.success) {
				toast.success(fetchCreateChatApi.message, {
					id: createChatToast,
				});
			}

			// if error
			if (fetchCreateChatApi.error) {
				toast.error(fetchCreateChatApi.message, {
					id: createChatToast,
				});
			}

			// set selected chat
			if (selectedChat?._id !== data._id) {
				setSelectedChat({
					_id: data._id,
					name: data.name,
					lastestMessage: data.lastestMessage,
					timestamps: data.timestamps,
				});
			}
		} catch (error) {
			toast.error("Something went wrong.", {
				id: createChatToast,
			});
		}
	}

	return (
		<div
			onClick={handleCreateChat}
			key={data._id}
			className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-3 rounded-xl"
		>
			<div
				className={`w-9 h-9 text-sm font-semibold cursor-pointer bg-gray-400 rounded-full flex justify-center text-main-white items-center`}
			>
				{data.firstName[0] + data.lastName[0]}
			</div>
			<div>
				<h1 className="font-semibold">
					{data.firstName + " " + data.lastName}
				</h1>
				<p className="font-medium text-sm opacity-70">{data.email}</p>
			</div>
		</div>
	);
}
