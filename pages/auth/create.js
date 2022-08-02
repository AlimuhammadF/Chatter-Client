import Image from "next/image";
import authHero from "../../public/auth.svg";
import Router from "next/router";

export default function Create() {
	function handleCreate(e) {
		e.preventDefault();
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
						onClick={() => Router.push("/auth/create")}
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
						/>
					</div>
				</div>
				<div className="mt-4 w-full">
					<p className="font-semibold text-sm opacity-80">Email</p>
					<input
						type="email"
						className="max-w-lg px-5 w-full h-14 border-2 border-main-black border-opacity-20 rounded-2xl bg-transparent"
						required
					/>
				</div>
				<div className="mt-4 w-full">
					<p className="font-semibold text-sm opacity-80">Password</p>
					<input
						type="password"
						className="max-w-lg px-5 w-full h-14 border-2 border-main-black border-opacity-20 rounded-2xl bg-transparent"
						required
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
					/>
				</div>
				<button className="w-full mt-5 bg-accent-blue h-14 text-main-white font-semibold rounded-2xl hover:bg-accent-hover transition-colors duration-300">
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
