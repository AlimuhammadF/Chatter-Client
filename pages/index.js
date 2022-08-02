import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";

export default function Home() {
	// current session
	const { data: session } = useSession();

	// redirect if no session found
	useEffect(() => {
		if (!session) {
			Router.push("/auth/login");
		}
	}, [session]);

	return <div>Hello World</div>;
}
