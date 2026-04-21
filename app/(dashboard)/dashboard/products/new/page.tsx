import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import { createProductAction } from "@/lib/actions/product";
import ProductForm from "@/components/products/ProductForm";

export default async function NewProductPage() {
  const token = await getServerToken();
  if (!token) redirect("/signin");

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/products" className="text-gray-400 hover:text-gray-700 text-sm">
          ← Products
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add product</h1>
        <p className="text-sm text-gray-400 mt-1">Fill in the details below to add a new product.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
        <ProductForm action={createProductAction} />
      </div>
    </div>
  );
}
