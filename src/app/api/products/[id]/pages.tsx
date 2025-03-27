"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product{
  _id?: string;
  name: string;
  price: number;
  image?: string;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  if (loading)
    return <p className="text-center text-gray-500">Chargement...</p>;
  if (!product)
    return <p className="text-center text-red-500">Produit non trouvé</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
      >
        Retour
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
      <p className="text-xl text-gray-600 mb-4">Prix : {product.price}€</p>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p className="text-gray-700">ID : {product._id}</p>
      </div>
    </div>
  );
}
