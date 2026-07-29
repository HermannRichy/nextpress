import type { Metadata } from "next";
import {
    getProductCategories,
    getProductTags,
    getPostCategories,
    getPostTags,
} from "./actions";
import { CategoriesTabs } from "@/components/admin/categories/categories-tabs";

export const metadata: Metadata = { title: "Catégories" };

export default async function CategoriesPage() {
    const [productCategories, productTags, postCategories, postTags] =
        await Promise.all([
            getProductCategories(),
            getProductTags(),
            getPostCategories(),
            getPostTags(),
        ]);

    return (
        <section>
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">Catégories & tags</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Organisez vos produits et vos posts. Les catégories
                    acceptent une hiérarchie parent/enfant.
                </p>
            </header>

            <CategoriesTabs
                productCategories={productCategories}
                productTags={productTags}
                postCategories={postCategories}
                postTags={postTags}
            />
        </section>
    );
}
