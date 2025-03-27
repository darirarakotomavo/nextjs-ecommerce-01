import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Product from "../../../models/Product";
import { v2 as cloudinary } from "cloudinary";

// Configuration de Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fonction pour uploader une image vers Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "image", folder: "ecommerce-01-products" }, // Dossier optionnel dans Cloudinary
        (error, result) => {
          if (error) {
            console.error("Erreur lors de l’upload vers Cloudinary :", error);
            reject(error);
          } else if (result) {
            resolve(result.secure_url); // Renvoie l’URL sécurisée de l’image
          }
        }
      )
      .end(buffer);
  });
}

export async function POST(request: Request) {
  await dbConnect();
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const imageFile = formData.get("image") as File | null;

  let image: string | undefined;
  if (imageFile) {
    try {
      image = await uploadToCloudinary(imageFile); // Upload vers Cloudinary
    } catch (error) {
      return NextResponse.json(
        { error: "Erreur lors de l’upload de l’image" },
        { status: 500 }
      );
    }
  }

  const product = new Product({ name, price, image });
  await product.save();
  console.log("Produit ajouté :", product);
  return NextResponse.json(product, { status: 201 });
}

export async function GET() {
  await dbConnect();
  const products = await Product.find();
  console.log("Produits trouvés :", products);
  return NextResponse.json(products);
}
