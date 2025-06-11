"use client";

import { motion } from "framer-motion";
import { Diamond } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex items-center justify-center h-full w-full">
			{/* <div className="text-center relative"> */}
			{/* Floating Sparkles Background */}
			{[...Array(8)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-1 h-1 bg-amber-300 rounded-full"
					style={{
						left: `${20 + i * 60}px`,
						top: `${30 + (i % 3) * 80}px`,
					}}
					animate={{
						opacity: [0, 1, 0],
						scale: [0, 1, 0],
					}}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						delay: i * 0.3,
					}}
				/>
			))}

			{/* Main Jewelry Ring Animation */}
			<div className="relative">
				<motion.div
					className="w-24 h-24 mx-auto relative"
					animate={{ rotate: 360 }}
					transition={{
						duration: 8,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				>
					{/* Ring Band */}
					<div className="absolute inset-2 border-4 border-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 rounded-full shadow-2xl">
						<div className="w-full h-full bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full" />
					</div>

					{/* Diamond/Gem on Ring */}
					<motion.div
						className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2"
						animate={{
							scale: [1, 1.2, 1],
							rotateY: [0, 180, 360],
						}}
						transition={{
							duration: 3,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					>
						<Diamond
							className="w-4 h-4 text-amber-200 drop-shadow-lg"
							fill="currentColor"
						/>
					</motion.div>
				</motion.div>

				{/* Ring Shine Effect */}
				<motion.div
					className="absolute inset-0 w-24 h-24 mx-auto rounded-full"
					style={{
						background:
							"conic-gradient(from 0deg, transparent, rgba(251, 191, 36, 0.3), transparent)",
					}}
					animate={{ rotate: 360 }}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
			</div>

			{/* Luxury Progress Bar */}
			{/* <div className="w-64 mx-auto">
					<div className="h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent relative overflow-hidden">
						<motion.div
							className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-amber-200 to-transparent"
							animate={{ x: ["-100%", "100%"] }}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						/>
					</div>
				</div> */}

			{/* Refined Progress Dots */}
			{/* <div className="flex justify-center space-x-3">
					{[0, 1, 2].map((index) => (
						<motion.div key={index} className="relative">
							<motion.div
								className="w-2 h-2 bg-amber-400/60 rounded-full"
								animate={{
									scale: [1, 1.4, 1],
									opacity: [0.4, 1, 0.4],
								}}
								transition={{
									duration: 1.8,
									repeat: Number.POSITIVE_INFINITY,
									delay: index * 0.3,
								}}
							/>
							<motion.div
								className="absolute inset-0 w-2 h-2 bg-amber-200 rounded-full"
								animate={{
									scale: [0, 1.2, 0],
									opacity: [0, 0.8, 0],
								}}
								transition={{
									duration: 1.8,
									repeat: Number.POSITIVE_INFINITY,
									delay: index * 0.3 + 0.2,
								}}
							/>
						</motion.div>
					))}
				</div> */}
			{/* </div> */}
		</div>
	);
}
