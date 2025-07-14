'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, DollarSign, Star, BarChart3, PieChart, Activity } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter, Area, AreaChart, Pie } from 'recharts';
import Image from 'next/image';

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
  priceRanges: Array<{name: string; count: number; range: string}>;
  ratingDistribution: Array<{rating: string; count: number}>;
  brandAnalysis: Array<{brand: string; count: number; avgPrice: number; avgRating: number}>;
  priceVsRating: Array<{price: number; rating: number; category: string; title: string}>;
  stockAnalysis: Array<{category: string; totalStock: number; avgStock: number; lowStock: number}>;
  discountAnalysis: Array<{category: string; avgDiscount: number; maxDiscount: number; productsWithDiscount: number}>;
  loading: boolean;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ffff00'];

export default function ProductAnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    totalCategories: 0,
    averageRating: 0,
    totalValue: 0,
    recentProducts: [],
    categoryBreakdown: {},
    priceRanges: [],
    ratingDistribution: [],
    brandAnalysis: [],
    priceVsRating: [],
    stockAnalysis: [],
    discountAnalysis: [],
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
      const brands: Record<string, {count: number; totalPrice: number; totalRating: number}> = {};
      const priceRanges = [
        {name: '$0-$25', count: 0, range: '0-25'},
        {name: '$25-$50', count: 0, range: '25-50'},
        {name: '$50-$100', count: 0, range: '50-100'},
        {name: '$100-$200', count: 0, range: '100-200'},
        {name: '$200+', count: 0, range: '200+'}
      ];
      const ratingDist: Record<string, number> = {};
      const stockByCategory: Record<string, {totalStock: number; count: number; lowStock: number}> = {};
      const discountByCategory: Record<string, {totalDiscount: number; maxDiscount: number; count: number; withDiscount: number}> = {};
      
      let totalRating = 0;
      let totalValue = 0;
      const priceVsRating: Array<{price: number; rating: number; category: string; title: string}> = [];

      data.products.forEach((product: Product) => {
        // Categories
        categories[product.category] = (categories[product.category] || 0) + 1;
        
        // Brands
        if (!brands[product.brand]) {
          brands[product.brand] = {count: 0, totalPrice: 0, totalRating: 0};
        }
        brands[product.brand].count++;
        brands[product.brand].totalPrice += product.price;
        brands[product.brand].totalRating += product.rating;
        
        // Price ranges
        if (product.price <= 25) priceRanges[0].count++;
        else if (product.price <= 50) priceRanges[1].count++;
        else if (product.price <= 100) priceRanges[2].count++;
        else if (product.price <= 200) priceRanges[3].count++;
        else priceRanges[4].count++;
        
        // Rating distribution
        const ratingKey = Math.floor(product.rating).toString();
        ratingDist[ratingKey] = (ratingDist[ratingKey] || 0) + 1;
        
        // Stock analysis
        if (!stockByCategory[product.category]) {
          stockByCategory[product.category] = {totalStock: 0, count: 0, lowStock: 0};
        }
        stockByCategory[product.category].totalStock += product.stock;
        stockByCategory[product.category].count++;
        if (product.stock < 20) stockByCategory[product.category].lowStock++;
        
        // Discount analysis
        if (!discountByCategory[product.category]) {
          discountByCategory[product.category] = {totalDiscount: 0, maxDiscount: 0, count: 0, withDiscount: 0};
        }
        discountByCategory[product.category].totalDiscount += product.discountPercentage;
        discountByCategory[product.category].maxDiscount = Math.max(discountByCategory[product.category].maxDiscount, product.discountPercentage);
        discountByCategory[product.category].count++;
        if (product.discountPercentage > 0) discountByCategory[product.category].withDiscount++;
        
        totalRating += product.rating;
        totalValue += product.price * product.stock;
        
        // Price vs Rating scatter data
        priceVsRating.push({
          price: product.price,
          rating: product.rating,
          category: product.category,
          title: product.title
        });
      });

      // Process brand analysis
      const brandAnalysis = Object.entries(brands)
        .map(([brand, data]) => ({
          brand,
          count: data.count,
          avgPrice: Number((data.totalPrice / data.count).toFixed(2)),
          avgRating: Number((data.totalRating / data.count).toFixed(2))
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Process rating distribution
      const ratingDistribution = Object.entries(ratingDist)
        .map(([rating, count]) => ({rating: `${rating} stars`, count}))
        .sort((a, b) => parseInt(a.rating) - parseInt(b.rating));

      // Process stock analysis
      const stockAnalysis = Object.entries(stockByCategory)
        .map(([category, data]) => ({
          category,
          totalStock: data.totalStock,
          avgStock: Number((data.totalStock / data.count).toFixed(0)),
          lowStock: data.lowStock
        }))
        .sort((a, b) => b.totalStock - a.totalStock);

      // Process discount analysis
      const discountAnalysis = Object.entries(discountByCategory)
        .map(([category, data]) => ({
          category,
          avgDiscount: Number((data.totalDiscount / data.count).toFixed(2)),
          maxDiscount: data.maxDiscount,
          productsWithDiscount: data.withDiscount
        }))
        .sort((a, b) => b.avgDiscount - a.avgDiscount);

      setDashboardData({
        totalProducts: data.products.length,
        totalCategories: Object.keys(categories).length,
        averageRating: Number((totalRating / data.products.length).toFixed(2)),
        totalValue: Number(totalValue.toFixed(0)),
        recentProducts: data.products.slice(0, 5),
        categoryBreakdown: categories,
        priceRanges,
        ratingDistribution,
        brandAnalysis,
        priceVsRating,
        stockAnalysis,
        discountAnalysis,
        loading: false
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const categoryPieData = Object.entries(dashboardData.categoryBreakdown).map(([category, count]) => ({
    name: category,
    value: count,

    percentage: ((count / dashboardData.totalProducts) * 100).toFixed(1)
  }));

  if (dashboardData.loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {[...Array(8)].map((_, i) => (
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
        <h1 className="text-3xl font-bold ml-9">Product Analytics Dashboard</h1>
        
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

      {/* Charts Row 1: Category and Price Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Category Distribution
            </CardTitle>
            <CardDescription>Product distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percentage}) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price Range Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Price Range Distribution
            </CardTitle>
            <CardDescription>Product count by price ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.priceRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Rating Distribution and Brand Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Rating Distribution
            </CardTitle>
            <CardDescription>Product count by rating levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Brands Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Brands Analysis
            </CardTitle>
            <CardDescription>Top 10 brands by product count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.brandAnalysis} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="brand" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3: Price vs Rating Scatter and Stock Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price vs Rating Scatter Plot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Price vs Rating Analysis
            </CardTitle>
            <CardDescription>Relationship between price and rating</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={dashboardData.priceVsRating}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="price" name="Price" unit="$" />
                <YAxis dataKey="rating" name="Rating" unit=" stars" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-semibold">{data.title}</p>
                          <p>Price: ${data.price}</p>
                          <p>Rating: {data.rating} stars</p>
                          <p>Category: {data.category}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter dataKey="rating" fill="#ff7300" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Analysis by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Stock Analysis by Category
            </CardTitle>
            <CardDescription>Total stock levels across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.stockAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalStock" fill="#00ff00" name="Total Stock" />
                <Bar dataKey="lowStock" fill="#ff0000" name="Low Stock Items" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 4: Discount Analysis and Brand Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discount Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Discount Analysis
            </CardTitle>
            <CardDescription>Average discount percentage by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.discountAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="avgDiscount" fill="#ff00ff" stroke="#ff00ff" name="Avg Discount %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Brand Performance (Price vs Rating) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Brand Performance
            </CardTitle>
            <CardDescription>Average price vs rating for top brands</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={dashboardData.brandAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="avgPrice" name="Avg Price" unit="$" />
                <YAxis dataKey="avgRating" name="Avg Rating" unit=" stars" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-semibold">{data.brand}</p>
                          <p>Products: {data.count}</p>
                          <p>Avg Price: ${data.avgPrice}</p>
                          <p>Avg Rating: {data.avgRating} stars</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter dataKey="avgRating" fill="#00ffff" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>Latest products from the API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentProducts.map((product: Product) => (
              <div key={product.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                <Image
  src={product.thumbnail}
  alt={product.title}
  width={64} 
  height={64} 
  className="rounded object-cover"
/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                  <p className="text-xs text-muted-foreground">Brand: {product.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${product.price}</p>
                  <p className="text-xs text-muted-foreground">★ {product.rating}</p>
                  <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}