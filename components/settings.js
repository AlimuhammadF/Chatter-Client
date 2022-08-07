import { DotsVerticalIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Settings() {
	// current user
	const { data: session } = useSession();

	// menu state
	const [menu, setMenu] = useState(false);

	// handle menu funtion
	function handleMenu() {
		if (menu) {
			setMenu(false);
		} else {
			setMenu(true);
		}
	}

	// handle logout
	async function handleLogout() {
		// logout toast
		const logoutToast = toast.loading("Loggin out...");

		// handle logout
		try {
			await signOut({
				redirect: false,
			});

			// success toast
			toast.success("Logged out successfully", { id: logoutToast });

			// update menu state
			setMenu(false);
		} catch (error) {
			toast.error("Logging out unsucessfull", { id: logoutToast });

			// update menu state
			setMenu(false);
		}
	}
	return (
		<div className=" relative z-50">
			<DotsVerticalIcon
				onClick={handleMenu}
				className="w-5 h-5 text-main-black ml-3 opacity-50 hover:opacity-100 transition-all duration-300"
			/>

			{menu && (
				<div className="absolute -left-10 w-screen max-w-sm flex flex-col items-center top-12 rounded-3xl bg-white drop-shadow-xl px-16 py-14">
					<h1 className="text-2xl font-semibold">
						Hi,{session?.user?.firstName}
					</h1>
					<p className="font-medium opacity-75 -translate-y-0.5">
						{session?.user?.email}
					</p>

					<button className="border-2 hover:border-opacity-100 hover:opacity-100 transition-all duration-300 border-main-black px-8 opacity-60 border-opacity-50 py-2.5 rounded-lg mt-7 font-semibold">
						Manage Account
					</button>
					<button
						onClick={handleLogout}
						className="border-2 hover:border-opacity-100 hover:opacity-100 transition-all duration-300 border-red-500 text-red-500 px-10 opacity-60 border-opacity-50 py-2.5 rounded-lg mt-3 font-semibold "
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
}
