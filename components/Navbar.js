import { useSession, signOut } from "next-auth/react";
import Router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { BellIcon } from "@heroicons/react/solid";

export default function Navbar() {
	// current session
	const { data: session } = useSession();

	// states
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
		<nav className="fixed bg-main-white top-0 h-20 flex flex-col items-center justify-center w-full px-8 md:px-10 z-50">
			<div className="flex items-center justify-between w-full max-w-screen-2xl">
				<h1
					onClick={() => Router.push("/")}
					className="text-2xl font-bold cursor-pointer"
				>
					Chatter.
				</h1>

				{session && (
					<div className="relative select-none flex items-center space-x-4">
						<div className="w-6 h-6 relative">
							<BellIcon />
							<span className="absolute -top-1 animate-pulse bg-red-500 text-main-white w-2.5 h-2.5 flex justify-center items-center text-xs rounded-full -right-0"></span>
						</div>

						<span
							onClick={handleMenu}
							className="w-9 h-9 text-lg font-semibold cursor-pointer bg-gradient-to-r from-cyan-500 to-accent-blue rounded-full flex justify-center text-main-white items-center"
						>
							{session?.user?.firstName[0] +
								session?.user?.lastName[0]}
						</span>

						{menu && (
							<div className="absolute right-0 w-screen max-w-sm flex flex-col items-center top-12 rounded-3xl bg-white drop-shadow-xl px-16 py-14">
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
				)}
			</div>
		</nav>
	);
}
