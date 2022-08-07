import { PlusIcon, UserAddIcon } from "@heroicons/react/solid";
import Chat from "./chat";
import { useRecoilState } from "recoil";
import { createChatState } from "../atoms/createChatModel";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SearchedUser from "./searchedUser";
import { useSession } from "next-auth/react";
import Settings from "./settings";

export default function Chats({
	setSelectedChat,
	selectedChat,
	socket,
	setChats,
	chats,
}) {
	// current sesison
	const { data: session } = useSession();

	// fetch all chats
	const [isChatsLoading, setIsChatsLoading] = useState(true);
	async function fetchAllChats() {
		try {
			const result = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_LOCATION}/api/v1/chat/fetchChats?user=${session?.user?._id}`,
				{ method: "GET" }
			).then(async (res) => {
				return await res.json();
			});

			const allchat = result.result.sort(function (a, b) {
				const c = new Date(a?.latestMessage?.createdAt);
				const d = new Date(b?.latestMessage?.createdAt);
				return d - c;
			});

			setChats(allchat);
			setIsChatsLoading(false);
			return;
		} catch (error) {
			console.error(error);
		}
	}
	useEffect(() => {
		fetchAllChats();
	}, []);

	// if received new caht
	async function fetchChatsOnIndication() {
		await socket.on("fetch-chat-indication-rec", async (data) => {
			console.log(data);
			await fetchAllChats();
		});
	}
	useEffect(() => {
		fetchChatsOnIndication();
	}, [socket]);

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
					`${process.env.NEXT_PUBLIC_SERVER_LOCATION}/api/v1/auth/searchUser?search=${searchInput}`,
					{ method: "GET" }
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
								<SearchedUser
									key={data._id}
									data={data}
									setSelectedChat={setSelectedChat}
									selectedChat={selectedChat}
									setCreateChat={setCreateChat}
									setSearch={setSearch}
									fetchAllChats={fetchAllChats}
									socket={socket}
								/>
							))}
						</div>
					</div>
				</div>
			)}
			<div className="border-r w-full p-5 h-full max-h-full max-w-xs border-opacity-30 border-main-black">
				<div className="flex justify-between items-center">
					<h1 className="font-bold text-xl">Chatter</h1>
					<div className="flex">
						<button
							onClick={handleCreateChatModel}
							className="w-6 h-6 text-main-black cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300"
						>
							<UserAddIcon className="" />
						</button>
						<button>
							<Settings />
						</button>
					</div>
				</div>
				<form className="border w-full h-10 border-main-black rounded-xl border-opacity-40 mt-5 mb-5">
					<input
						type="text"
						className="w-full px-4 text-sm h-full rounded-xl bg-transparent"
						placeholder="Search"
					/>
				</form>
				{isChatsLoading ? (
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
					<div
						className="overflow-y-scroll no-scrollbar"
						style={{ maxHeight: "82vh" }}
					>
						{chats?.map((chat) => (
							<Chat
								key={chat._id}
								chat={chat}
								setSelectedChat={setSelectedChat}
								selectedChat={selectedChat}
								socket={socket}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
}
