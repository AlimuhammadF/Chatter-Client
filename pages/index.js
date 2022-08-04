import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";

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

	return <div>Hello World</div>;
}
