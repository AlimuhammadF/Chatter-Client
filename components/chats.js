import { PlusIcon, UserAddIcon } from "@heroicons/react/solid";
import Chat from "./chat";
import { useRecoilState } from "recoil";
import { createChatState } from "../atoms/createChatModel";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Chats({ setSelectedChat, selectedChat }) {
	// create chat state
	const [createChat, setCreateChat] = useRecoilState(createChatState);

	// handle create chat model
	function handleCreateChatModel() {
		if (createChat) {
			setCreateChat(false);
		} else {
			setCreateChat(true);
		}
	}

	// all search result
	const [search, setSearch] = useState([]);

	// handle search users
	const [searchInput, setSearchInput] = useState("");

	async function handleSearchUser(e) {
		e.preventDefault();

		// search toast
		const searchToast = toast.loading("Searching...");

		// if search is not empty
		if (searchInput) {
			try {
				const result = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_LOCATION}/api/v1/auth/searchUser?search=${searchInput}`
				).then(async (res) => {
					return await res.json();
				});

				// if success
				if (result.success) {
					setSearch(result.result);
					toast.success(result.message, {
						id: searchToast,
					});
				}

				// if error
				if (result.error) {
					setSearch(result.result);
					toast.error(result.message, {
						id: searchToast,
					});
				}
			} catch (error) {
				toast.error("Something went wrong.", {
					id: searchToast,
				});
			}
		}
	}

	// handle create chat
	async function handleCreateChat() {}

	const chats = [
		{
			_id: "123",
			name: "alimuhammad",
			lastestMessage:
				"Yo how are you my guy hope you fine. Your friend Zxies.",
			timestamps: "Today, 19:23",
		},
		{
			_id: "1234",
			name: "alimuhammad",
			lastestMessage:
				"Yo how are you my guy hope you fine. Your friend Zxies.",
			timestamps: "Today, 19:23",
		},
		,
		{
			_id: "12345",
			name: "alimuhammad",
			lastestMessage:
				"Yo how are you my guy hope you fine. Your friend Zxies.",
			timestamps: "Today, 19:23",
		},
	];

	return (
		<>
			{createChat && (
				<div className="fixed w-screen flex items-center backdrop-blur-sm bg-main-black bg-opacity-50 z-10 justify-center h-screen left-0 top-0 bottom-0">
					<div className="bg-main-white px-8 rounded-2xl flex flex-col items-center space-y-4 py-8">
						<div className="flex justify-between w-full">
							<h1 className="font-semibold opacity-80 text-xl">
								Start a new chat
							</h1>
							<div
								onClick={() => setCreateChat(false)}
								className="w-7 h-7 cursor-pointer"
							>
								<PlusIcon className="text-red-500 rotate-45" />
							</div>
						</div>
						<form onSubmit={handleSearchUser}>
							<input
								type="text"
								placeholder="Search User"
								className="border border-opacity-50 bg-transparent border-main-black px-6 py-2.5 rounded-xl"
								onChange={(e) => setSearchInput(e.target.value)}
							/>
						</form>
						<div className="w-full max-h-96 overflow-y-scroll">
							{search.map((data) => (
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
											{data.firstName +
												" " +
												data.lastName}
										</h1>
										<p className="font-medium text-sm opacity-70">
											{data.email}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			<div className="border-r w-full p-5 h-full max-h-full max-w-xs border-opacity-30 border-main-black">
				<div className="flex justify-between items-center">
					<h1 className="font-bold text-xl">Chatter</h1>
					<button
						onClick={handleCreateChatModel}
						className="w-6 h-6 text-main-black cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300"
					>
						<UserAddIcon className="" />
					</button>
				</div>
				<form className="border w-full h-10 border-main-black rounded-xl border-opacity-40 mt-5 mb-5">
					<input
						type="text"
						className="w-full px-4 text-sm h-full rounded-xl bg-transparent"
						placeholder="Search"
					/>
				</form>
				<div
					className="overflow-y-scroll"
					style={{ maxHeight: "82vh" }}
				>
					{chats.map((chat) => (
						<Chat
							key={chat._id}
							chat={chat}
							setSelectedChat={setSelectedChat}
							selectedChat={selectedChat}
						/>
					))}
				</div>
			</div>
		</>
	);
}
