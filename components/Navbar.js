import { useSession } from "next-auth/react";
import Router from "next/router";

export default function Navbar() {
	// current session
	const { data: session } = useSession();

	return (
		<nav className="fixed bg-main-white top-0 h-20 flex flex-col items-center justify-center w-full px-8 md:px-10 z-50">
			<div className="flex flex-col w-full max-w-screen-2xl">
				<h1
					onClick={() => Router.push("/")}
					className="text-2xl font-bold cursor-pointer"
				>
					Chatter.
				</h1>
				{session && <div>If Logged in</div>}
			</div>
		</nav>
	);
}
