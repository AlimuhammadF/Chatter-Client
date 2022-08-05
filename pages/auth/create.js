import Image from "next/image";
import authHero from "../../public/auth.svg";
import Router from "next/router";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Create() {
	// current session
	const { data: session } = useSession();

	// redirect if user found
	useEffect(() => {
		if (session) {
			Router.push("/");
		}
	}, [session]);

	// refs
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// handle create account function
	async function handleCreate(e) {
		e.preventDefault();

		// check if password and confirm match
		if (password !== confirmPassword) {
			toast.error("Password must match.");
			return;
		}

		// createing toast
		const createUserToast = toast.loading("Creating...");

		// structure user data
		const userData = {
			firstName,
			lastName,
			email,
			password,
		};

		// fetching api
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_LOCATION}/api/v1/auth/create`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(userData),
				}
			).then(async (res) => {
				return await res.json();
			});

			// if success
			if (res.success) {
				// push to login
				Router.push("/auth/login");

				toast.success(res.message, { id: createUserToast });
				return;
			}

			// if error
			if (res.error) {
				toast.error(res.message, { id: createUserToast });
				return;
			}
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong", { id: createUserToast });
		}
	}

	return (
		<div className="w-full mx-auto py-28 gap-7 max-w-screen-xl space-x-3 flex justify-center cus:justify-between min-h-screen px-8 md:px-10">
			{/* Section left create */}
			<form
				onSubmit={handleCreate}
				className="max-w-lg mb-14 col-span-1 w-full flex flex-col items-start justify-center"
			>
				<h1 className="font-semibold text-3xl">Create an account</h1>
				<p className="text-opacity-60">
					Already have an account?{" "}
					<span
						onClick={() => Router.push("/auth/login")}
						className="font-bold text-accent-blue cursor-pointer hover:underline "
					>
						Login
					</span>
				</p>
				<div className="mt-10 w-full max-w-lg flex flex-col sm:flex-row sm:space-x-6">
					<div className=" w-full">
						<p className="font-semibold text-sm opacity-80">
							First Name
						</p>
						<input
							type="text"
							className="max-w-lg px-5 w-full h-14 border-2 border-main-black border-opacity-20 rounded-2xl bg-transparent"
							required
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</div>
					<div className="mt-4 sm:mt-0 w-full">
						<p className="font-semibold text-sm opacity-80">
							Last Name
						</p>
						<input
							type="text"
							className="max-w-lg px-5 w-full h-14 border-2 border-main-black border-opacity-20 rounded-2xl bg-transparent"
							required
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>
				</div>
				<div className="mt-4 w-full">
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
				</div>
				<div className="mt-4 w-full">
					<p className="font-semibold text-sm opacity-80">
						Confirm Password
					</p>
					<input
						type="password"
						className="max-w-lg px-5 w-full h-14 border-2 border-main-black border-opacity-20 rounded-2xl bg-transparent"
						required
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button className="w-full mt-5 bg-accent-blue h-14 text-main-white font-semibold rounded-2xl hover:bg-accent-hover transition-colors duration-300">
					Create Account
				</button>
			</form>

			{/* hero image */}
			<section className="col-span-1 hidden cus:flex hidden justify-end items-center mb-14">
				<Image src={authHero} alt="hero-image" />
			</section>
		</div>
	);
}
