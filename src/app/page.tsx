"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { increment, decrement } from "../store/counterSlice";
import Link from "next/link";

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter.value);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center">
        Bienvenue sur E-commerce
      </h1>
      <p className="mt-4 text-lg">Compteur Redux : {count}</p>
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => dispatch(increment())}
      >
        Incrémenter
      </button>
      <button
        className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded"
        onClick={() => dispatch(decrement())}
      >
        Décrémenter
      </button>
      <Link href="/products" className="mt-4 block text-blue-600 underline">
        Voir nos produits
      </Link>
      <Link href="/admin" className="mt-2 block text-blue-600 underline">
        Panneau d’administration
      </Link>
    </div>
  );
}
