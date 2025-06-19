
import { ProductCategory } from "@/components/product/ProductCategory";

interface ProductListContainerProps {
  categories: Array<{
    name: string;
    products: Array<{
      id: string;
      name: string;
      rating: number;
      reviews: number;
      image: string;
    }>;
  }>;
  selectedProducts: {[key: string]: string};
  onProductSelect: (categoryName: string, productId: string) => void;
}

export const ProductListContainer = ({ 
  categories, 
  selectedProducts, 
  onProductSelect 
}: ProductListContainerProps) => {
  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="space-y-8">
        {categories.map((category, categoryIndex) => (
          <ProductCategory
            key={categoryIndex}
            category={category}
            selectedProducts={selectedProducts}
            onProductSelect={onProductSelect}
          />
        ))}
      </div>
    </div>
  );
};
