import Layout from "../components/Layout";
import "../styles/globals.css";
import "../styles/nprogress.css";
import { SessionProvider } from "next-auth/react";
import Router from "next/router";
import nProgress from "nprogress";

// nprogress bar
Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeComplete", nProgress.done);
Router.events.on("routeChangeError", nProgress.done);

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	return (
		<SessionProvider session={session}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</SessionProvider>
	);
}
