'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, Users, DollarSign, Star, ShoppingCart } from 'lucide-react';

// Type definitions
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
  reviews: Review[];
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

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  averageRating: number;
  totalValue: number;
  recentProducts: Product[];
  categoryBreakdown: Record<string, number>;
  loading: boolean;
}

export default function DashboardPage(){
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    totalCategories: 0,
    averageRating: 0,
    totalValue: 0,
    recentProducts: [],
    categoryBreakdown: {},
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data: ApiResponse = await response.json();
      
      // Calculate analytics
      const categories: Record<string, number> = {};
      let totalRating = 0;
      let totalValue = 0;

      data.products.forEach((product: Product) => {
        categories[product.category] = (categories[product.category] || 0) + 1;
        totalRating += product.rating;
        totalValue += product.price * product.stock;
      });

      setDashboardData({
        totalProducts: data.products.length,
        totalCategories: Object.keys(categories).length,
        averageRating: Number((totalRating / data.products.length).toFixed(2)),
        totalValue: Number(totalValue.toFixed(0)),
        recentProducts: data.products.slice(0, 5),
        categoryBreakdown: categories,
        loading: false
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  if (dashboardData.loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to myjobb AI</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Latest products from the API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentProducts.map((product: Product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${product.price}</p>
                    <p className="text-xs text-muted-foreground">★ {product.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(dashboardData.categoryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{count}</span>
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / dashboardData.totalProducts) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common dashboard actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Add Product
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              Export Data
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
              Generate Report
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
              View Analytics
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}