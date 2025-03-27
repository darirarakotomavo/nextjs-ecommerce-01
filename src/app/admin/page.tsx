"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchProducts,
  addProductAsync,
  deleteProductAsync,
  updateProductAsync,
} from "../../store/productSlice";
import Image from "next/image"; // Importation de Image de Next.js

export default function Admin() {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading } = useSelector(
    (state: RootState) => state.products
  );
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddOrUpdateProduct = () => {
    if (!productName || !productPrice) return;

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    if (productImage) {
      formData.append("image", productImage);
    }

    if (editId) {
      formData.append("_id", editId);
      dispatch(updateProductAsync(formData));
      setEditId(null);
    } else {
      dispatch(addProductAsync(formData));
    }

    setProductName("");
    setProductPrice("");
    setProductImage(null);
  };

  const handleEdit = (product: {
    _id?: string; // _id est optionnel pour gérer les cas undefined
    name: string;
    price: number;
    image?: string;
  }) => {
    if (!product._id) return; // Vérification pour éviter undefined
    setEditId(product._id);
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductImage(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteProductAsync(id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Chargement...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Panneau d’Administration
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="productName" className="block mb-1 text-gray-700">
            Nom du produit
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nom du produit"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-32">
          <label htmlFor="productPrice" className="block mb-1 text-gray-700">
            Prix
          </label>
          <input
            type="number"
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Prix"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="productImage" className="block mb-1 text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="productImage"
            accept="image/*"
            onChange={handleImageChange}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAddOrUpdateProduct}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition self-end"
        >
          {editId ? "Modifier" : "Ajouter"}
        </button>
      </div>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="object-cover rounded"
                />
              )}
              <span className="text-lg font-medium text-gray-700">
                {product.name} - {product.price}€
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(product._id!)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
