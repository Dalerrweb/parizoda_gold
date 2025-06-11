import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "@/lib/axios";
import ProductDetails, { Product } from "@/components/custom/product-details";
import Loading from "@/components/animations/loading";

export default function ProductPage() {
	const [product, setProducts] = useState<Product | null>(null);
	const { id } = useParams();

	useEffect(() => {
		async function fetchPorduct() {
			try {
				const res = await axios.get("/products/" + id);

				setProducts(res.data);
			} catch (e: any) {
				console.log(e.message);
				setProducts(null);
			}
		}

		fetchPorduct();
	}, []);

	return product ? <ProductDetails product={product} /> : <Loading />;
}
