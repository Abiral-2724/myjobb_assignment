'use client';

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

// Modal Component
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

// Product Detail Modal Component
const ProductDetailModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div>
            <img 
              src={product.thumbnail} 
              alt={product.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1, 4).map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Brand:</span> {product.brand}
              </div>
              <div>
                <span className="font-semibold">Category:</span> {product.category}
              </div>
              <div>
                <span className="font-semibold">SKU:</span> {product.sku}
              </div>
              <div>
                <span className="font-semibold">Stock:</span> {product.stock}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-3xl font-bold">${product.price}</span>
                <span className="text-green-600 font-semibold">{product.discountPercentage}% OFF</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 font-semibold">{product.rating}</span>
                <span className="ml-2 text-gray-600">({product.reviews?.length || 0} reviews)</span>
              </div>
            </div>

            <div>
              <span className="font-semibold">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                product.availabilityStatus === 'In Stock' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.availabilityStatus}
              </span>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div>
                <span className="font-semibold">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 space-y-4">
          {product.dimensions && (
            <div>
              <h3 className="font-semibold mb-2">Dimensions & Weight</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>Width: {product.dimensions.width}"</div>
                <div>Height: {product.dimensions.height}"</div>
                <div>Depth: {product.dimensions.depth}"</div>
                <div>Weight: {product.weight} lbs</div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Shipping & Returns</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Shipping:</span> {product.shippingInformation}</p>
              <p><span className="font-medium">Return Policy:</span> {product.returnPolicy}</p>
              <p><span className="font-medium">Warranty:</span> {product.warrantyInformation}</p>
              <p><span className="font-medium">Minimum Order:</span> {product.minimumOrderQuantity}</p>
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Recent Reviews</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {product.reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 font-semibold">{review.rating}</span>
                      <span className="ml-2 text-sm text-gray-600">by {review.reviewerName}</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

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
      <h1 className="text-3xl font-bold">Products Dashboard</h1>
      
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
                    <img 
                      src={product.thumbnail} 
                      alt={product.title} 
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