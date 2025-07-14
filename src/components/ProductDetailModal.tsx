'use client'
import Modal from "./Modal";
import { ChevronLeft, ChevronRight, Heart, Package, RotateCcw, Share2, Shield, ShoppingCart, Star, Truck } from 'lucide-react';
import { useState} from 'react';

const ProductDetailModal = ({ product, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    
    const images = product.images || [product.thumbnail];
    
    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };
    
    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    
    const originalPrice = product.price / (1 - product.discountPercentage / 100);
    
    return (
      <Modal isOpen={true} onClose={onClose}>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Enhanced Product Images */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  <img 
                    src={images[currentImageIndex]} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (

                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
  
            {/* Enhanced Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{product.brand}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
  
              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                  <span className="ml-2 font-semibold text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-500">({product.reviews?.length || 0} reviews)</span>
              </div>
  
              {/* Pricing */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <span className="text-xl text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                    {product.discountPercentage}% OFF
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package size={16} />
                  <span>Stock: {product.stock} units available</span>
                </div>
              </div>
  
              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
  
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-lg border transition-colors ${
                      isLiked 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                  </button>
                  <button className="p-3 rounded-lg border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
  
              {/* Status and Tags */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.availabilityStatus === 'In Stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.availabilityStatus}
                  </span>
                </div>
  
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <span className="font-medium mb-2 block">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
  
          {/* Enhanced Additional Information */}
          <div className="border-t pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Specifications */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Brand</div>
                      <div className="font-semibold">{product.brand}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">SKU</div>
                      <div className="font-semibold">{product.sku}</div>
                    </div>
                  </div>
                  
                  {product.dimensions && (
                    <div>
                      <h4 className="font-semibold mb-2">Dimensions & Weight</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Width: {product.dimensions.width}"</div>
                        <div>Height: {product.dimensions.height}"</div>
                        <div>Depth: {product.dimensions.depth}"</div>
                        <div>Weight: {product.weight} lbs</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Shipping & Returns */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Shipping & Returns</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <Truck className="text-blue-600 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-blue-900">Shipping</div>
                      <div className="text-sm text-blue-700">{product.shippingInformation}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <RotateCcw className="text-green-600 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-green-900">Returns</div>
                      <div className="text-sm text-green-700">{product.returnPolicy}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                    <Shield className="text-purple-600 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-purple-900">Warranty</div>
                      <div className="text-sm text-purple-700">{product.warrantyInformation}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="border-t pt-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {review.reviewerName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{review.reviewerName}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

export default ProductDetailModal ;