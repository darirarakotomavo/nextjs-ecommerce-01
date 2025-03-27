import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Product from "../../../../models/Product";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const imageFile = formData.get("image") as File | null;

  let image: string | undefined;
  if (imageFile) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
  }

  const updateData: { name: string; price: number; image?: string } = {
    name,
    price,
  };
  if (image) updateData.image = image;

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  console.log("Produit mis à jour :", updatedProduct);
  return NextResponse.json(updatedProduct, { status: 200 });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;
  await Product.findByIdAndDelete(id);
  console.log("Produit supprimé :", id);
  return NextResponse.json({ message: "Produit supprimé" }, { status: 200 });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;
  const product = await Product.findById(id);
  console.log("Produit récupéré :", product);
  return NextResponse.json(product);
}
