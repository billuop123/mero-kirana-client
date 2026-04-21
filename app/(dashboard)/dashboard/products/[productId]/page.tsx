import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth";
import { updateProductAction, deleteProductAction } from "@/lib/actions/product";
import ProductForm from "@/components/products/ProductForm";
import RestockForm from "@/components/products/RestockForm";
import { Product, Shop } from "@/lib/types";
import NoShopPrompt from "@/components/NoShopPrompt";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

type Props = { params: Promise<{ productId: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = await params;
  const token = await getServerToken();
  if (!token) redirect("/signin");

  const shopRes = await fetch(`${API}/shops/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!shopRes.ok) return <NoShopPrompt />;
  const shop: Shop = (await shopRes.json()).data;

  const productRes = await fetch(`${API}/shops/${shop.id}/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
  if (!productRes.ok) notFound();
  const product: Product = (await productRes.json()).data;

  const updateAction = updateProductAction.bind(null, productId);
  const deleteAction = deleteProductAction.bind(null, productId);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/products" className="text-gray-400 hover:text-gray-700 text-sm">
          ← Products
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-400 mt-1 capitalize">{product.category} · {product.unit}</p>
        </div>
        <form action={deleteAction}>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Product details</h2>
          <ProductForm product={product} action={updateAction} />
        </div>

        {/* Restock */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Restock</h2>
          <p className="text-xs text-gray-400 mb-5">Add incoming stock quantity.</p>
          <RestockForm productId={productId} />
        </div>
      </div>
    </div>
  );
}
