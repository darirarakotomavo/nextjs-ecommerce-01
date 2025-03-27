import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface ProductType {
  _id?: string;
  name: string;
  price: number;
  image?: string;
}

interface ProductState {
  products: ProductType[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Erreur lors du chargement des produits");
    return (await response.json()) as ProductType[];
  }
);

export const addProductAsync = createAsyncThunk(
  "products/addProduct",
  async (formData: FormData) => {
    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Erreur lors de l’ajout du produit");
    return (await response.json()) as ProductType;
  }
);

export const deleteProductAsync = createAsyncThunk(
  "products/deleteProduct",
  async (id: string) => {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!response.ok)
      throw new Error("Erreur lors de la suppression du produit");
    return id;
  }
);

export const updateProductAsync = createAsyncThunk(
  "products/updateProduct",
  async (formData: FormData) => {
    const id = formData.get("_id") as string;
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok)
      throw new Error("Erreur lors de la modification du produit");
    return (await response.json()) as ProductType;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<ProductType[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur inconnue";
      })
      .addCase(
        addProductAsync.fulfilled,
        (state, action: PayloadAction<ProductType>) => {
          state.products.push(action.payload);
        }
      )
      .addCase(
        deleteProductAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.products = state.products.filter(
            (p) => p._id !== action.payload
          );
        }
      )
      .addCase(
        updateProductAsync.fulfilled,
        (state, action: PayloadAction<ProductType>) => {
          const index = state.products.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) state.products[index] = action.payload;
        }
      );
  },
});

export default productSlice.reducer;
