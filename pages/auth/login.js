import Image from "next/image";
import authHero from "../../public/auth.svg";
import Router from "next/router";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Login() {
	// current session
	const { data: session } = useSession();

	// redirect if user found
	useEffect(() => {
		if (session) {
			Router.push("/");
		}
	}, [session]);

	// refs
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// handle login function
	async function handleLogin(e) {
		e.preventDefault();

		// create login toast
		const loginAccountToast = toast.loading("Logging in...");

		try {
			// login
			await signIn("credentials", {
				redirect: false,
				email,
				password,
			})
				.then((error) =>
					!error.error
						? toast.success("logged in succussfully", {
								id: loginAccountToast,
						  })
						: toast.error(error.error, { id: loginAccountToast })
				)
				.catch((error) =>
					!error.error
						? toast.success("logged in succussfully", {
								id: loginAccountToast,
						  })
						: toast.error(error.error, { id: loginAccountToast })
				);
		} catch (error) {
			// if error
			console.log(error);
			toast.error("Something went wrong", { id: loginAccountToast });
			return;
		}
	}

	return (
		<div className="w-full mx-auto py-28 gap-7 max-w-screen-xl space-x-3 flex justify-center cus:justify-between min-h-screen px-8 md:px-10">
			{/* Section left Login */}
			<form
				onSubmit={handleLogin}
				className="max-w-lg mb-14 col-span-1 w-full flex flex-col items-start justify-center"
			>
				<h1 className="font-semibold text-3xl">Welcome Back</h1>
				<p className="text-opacity-60">
					Want to create an account?{" "}
					<span
						onClick={() => Router.push("/auth/create")}
						className="font-bold text-accent-blue cursor-pointer hover:underline "
					>
						Create
					</span>
				</p>
				<div className="mt-10 w-full">
					<p className="font-semibold text-sm opacity-80">Email</p>
					<input
						type="email"
						className="max-w-lg px-5 w-full h-14 border-2 border-main-black border-opacity-20 rounded-2xl bg-transparent"
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="mt-4 w-full">
					<p className="font-semibold text-sm opacity-80">Password</p>
					<input
						type="password"
						className="max-w-lg px-5 w-full h-14 border-2 border-main-black border-opacity-20 rounded-2xl bg-transparent"
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className="w-full flex justify-end">
						<button
							type="button"
							className="font-semibold text-sm opacity-80 hover:underline mt-1.5"
						>
							Forget Password?
						</button>
					</div>
				</div>
				<button className="w-full mt-3 bg-accent-blue h-14 text-main-white font-semibold rounded-2xl hover:bg-accent-hover transition-colors duration-300">
					Login Account
				</button>
			</form>

			{/* hero image */}
			<section className="col-span-1 hidden cus:flex hidden justify-end items-center mb-14">
				<Image src={authHero} alt="hero-image" />
			</section>
		</div>
	);
}
