import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Container from "../components/container";

// socket connection
const socket = io.connect(process.env.NEXT_PUBLIC_SERVER_LOCATION);

export default function Home() {
	// current session
	const { data: session } = useSession();

	// setup personal room for user
	useEffect(() => {
		socket.emit("setup", { userId: session?.user?._id });
	}, []);

	// redirect if no session found
	useEffect(() => {
		if (!session) {
			Router.push("/auth/login");
		}
	}, [session]);

	return (
		<div className="w-full mx-auto max-w-screen-2xl gap-7 space-x-3 flex justify-center cus:justify-between min-h-screen px-8 md:px-10">
			<Container socket={socket} />
		</div>
	);
}
