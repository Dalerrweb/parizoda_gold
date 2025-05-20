import { Button } from "@/components/ui/button";
import React from "react";

interface homeProps {}

const Home: React.FC<homeProps> = () => {
	return (
		<div>
			Home page
			<Button>Click</Button>
		</div>
	);
};

export default Home;
