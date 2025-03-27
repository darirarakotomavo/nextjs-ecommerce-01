"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchProducts } from "../../store/productSlice";
import Link from "next/link";

export default function Products() {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading } = useSelector(
    (state: RootState) => state.products
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <p className="text-center text-gray-500">Chargement...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Nos Produits
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredProducts.length > 0 ? (
          <ul className="contents">
            {" "}
            {/* Modification ici */}
            {filteredProducts.map((product) => (
              <li
                key={product._id}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <Link href={`/products/${product._id}`} className="block">
                  <h2 className="text-xl font-semibold text-gray-700">
                    {product.name}
                  </h2>
                  <p className="text-lg text-gray-600">{product.price}€</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="col-span-full text-center">
            {" "}
            {/* Modification ici */}
            <p className="text-gray-500">Aucun produit trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
}
