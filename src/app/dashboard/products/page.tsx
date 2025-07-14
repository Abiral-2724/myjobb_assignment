'use client';

import ProductDetailModal from '@/components/ProductDetailModal';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Define interfaces for type safety
interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
}

interface Analytics {
  categories: Record<string, number>;
  priceRanges: Record<string, number>;
  averageRating: string;
  totalProducts: number;
}

// Simple Card components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold">
    {children}
  </h3>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-600">
    {children}
  </p>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">
    {children}
  </div>
);

// Simple Table components
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50">
    {children}
  </thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>
    {children}
  </tbody>
);

const TableRow = ({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <tr className={`border-b border-gray-200 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${className}`} onClick={onClick}>
    {children}
  </tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left p-3 font-medium text-gray-700">
    {children}
  </th>
);

const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`p-3 ${className}`}>
    {children}
  </td>
);


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>({
    categories: {},
    priceRanges: { '0-50': 0, '50-100': 0, '100-500': 0, '500+': 0 },
    averageRating: '0',
    totalProducts: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data: ProductsResponse = await response.json();
      setProducts(data.products);
      calculateAnalytics(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (products: Product[]): void => {
    const categories: Record<string, number> = {};
    const priceRanges = { '0-50': 0, '50-100': 0, '100-500': 0, '500+': 0 };
    let totalRating = 0;

    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
      
      if (product.price < 50) priceRanges['0-50']++;
      else if (product.price < 100) priceRanges['50-100']++;
      else if (product.price < 500) priceRanges['100-500']++;
      else priceRanges['500+']++;
      
      totalRating += product.rating;
    });

    setAnalytics({
      categories,
      priceRanges,
      averageRating: (totalRating / products.length).toFixed(2),

      totalProducts: products.length,
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold ml-9">Products Dashboard</h1>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.totalProducts}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.averageRating}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{Object.keys(analytics.categories || {}).length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Price Range</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Most products under $100</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Complete list of products from the API (click any row to view details)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow 
                  key={product.id} 
                  onClick={() => handleProductClick(product)}
                >
                  <TableCell>
                  <Image
  src={product.thumbnail}
  alt={product.title}
  width={48}
  height={48}
  className="w-12 h-12 rounded object-cover"
/>
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.rating}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Detail Modal */}

      {selectedProduct && (
        <ProductDetailModal

          product={selectedProduct} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}