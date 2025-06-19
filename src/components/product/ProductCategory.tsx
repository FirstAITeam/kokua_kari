import { Card } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Product {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  image: string;
}

interface ProductCategoryProps {
  category: {
    name: string;
    products: Product[];
  };
  selectedProducts: { [key: string]: string };
  onProductSelect: (categoryName: string, productId: string) => void;
}

export const ProductCategory = ({
  category,
  selectedProducts,
  onProductSelect,
}: ProductCategoryProps) => {
  return (
    <div className="space-y-4 border-4 border-[#40414F] rounded-xl p-8 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">{category.name}</h2>
      </div>
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-6 pb-6 pl-2 pt-2 pr-6">
            {category.products.map((product) => (
              <Card 
                key={product.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg flex-shrink-0 w-[280px] md:w-[320px] ${
                  selectedProducts[category.name] === product.id ? 'ring-4 ring-[#40414F]' : ''
                }`}
                onClick={() => onProductSelect(category.name, product.id)}
              >
                <div className="relative">
                  {selectedProducts[category.name] === product.id && (
                    <div className="absolute -top-2 -right-2 bg-[#40414F] text-white p-2 rounded-full">
                      <Edit2 className="h-4 w-4" />
                    </div>
                  )}
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-yellow-500">
                      {"★".repeat(Math.floor(product.rating))}
                      {"☆".repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews})
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};