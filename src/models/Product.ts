import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Champ pour l'image en Base64
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
