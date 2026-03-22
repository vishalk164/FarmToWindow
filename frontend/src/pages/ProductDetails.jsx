import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { api, user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [selectedQty, setSelectedQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const prodRes = await api.get(`/products/${id}`);
        setProduct(prodRes.data);
        const revRes = await api.get(`/reviews/${id}`);
        setReviews(revRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, api]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/reviews/${id}`, newReview);
      setReviews([data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(i => i.productId === product.id);
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].cartQuantity = (existingCart[existingItemIndex].cartQuantity || existingCart[existingItemIndex].quantity) + selectedQty;
    } else {
      existingCart.push({ ...product, productId: product.id, cartQuantity: selectedQty });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    toast.success(`${selectedQty} ${product.unit}(s) added to cart!`);
  };

  const buyNow = () => {
    addToCart();
    navigate('/customer/cart');
  };

  if (loading) return <div className="text-center mt-10">Loading product...</div>;
  if (!product) return <div className="text-center mt-10 text-red-500">Product not found</div>;

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-6 font-semibold">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row gap-8 p-8 mb-8">
        <div className="md:w-1/2 bg-gray-100 rounded-xl min-h-[300px] flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full rounded-xl" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
        
        <div className="md:w-1/2 flex flex-col justify-center">
          <span className="text-sm text-green-600 font-bold tracking-wider uppercase mb-2">{product.category}</span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.round(avgRating) ? "currentColor" : "none"} />)}
            </div>
            <span className="text-gray-600 font-medium">{avgRating} ({reviews.length} reviews)</span>
          </div>
          
          <p className="text-gray-600 mb-6 text-lg">{product.description || "Fresh produce harvested locally and brought straight to you."}</p>
          
          <div className="flex items-end gap-4 mb-8">
            <span className="text-4xl font-black text-green-700">₹{product.price}</span>
            <span className="text-gray-500 mb-1">/ {product.unit || 'unit'}</span>
          </div>
          
          <div className="bg-gray-50 border rounded-xl p-4 mb-8">
            <p className="text-sm text-gray-500 mb-1">Sold by Farmer</p>
            <p className="font-bold text-gray-800">{product.farmerName}</p>
          </div>

          {product.quantity > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 border p-3 rounded-xl max-w-fit mb-4 text-lg">
                <span className="font-semibold text-gray-600">Quantity</span>
                <button onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))} className="text-2xl px-3 hover:text-green-600 font-bold">-</button>
                <span className="font-bold w-8 text-center">{selectedQty}</span>
                <button onClick={() => setSelectedQty(Math.min(product.quantity, selectedQty + 1))} className="text-2xl px-3 hover:text-green-600 font-bold">+</button>
                <span className="text-sm font-medium text-gray-400 ml-2">({product.quantity} available)</span>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={addToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg bg-green-100 text-green-800 hover:bg-green-200 transition-all shadow-sm"
                >
                  <ShoppingCart size={24} />
                  Add to Cart
                </button>
                <button 
                  onClick={buyNow}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ) : (
            <button disabled className="w-full py-4 rounded-xl font-bold text-lg bg-gray-300 text-gray-500 cursor-not-allowed">
              Out of Stock
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {user?.role === 'CUSTOMER' && (
          <form onSubmit={submitReview} className="mb-10 bg-gray-50 p-6 rounded-xl border">
            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select 
                value={newReview.rating} 
                onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                className="border p-2 rounded w-32 outline-none"
              >
                {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>
            <div className="mb-4">
              <textarea 
                required
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Share your experience with this product..."
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">
              Submit Review
            </button>
          </form>
        )}

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-gray-800">{review.customerName}</span>
                    <span className="text-gray-500 text-sm ml-3">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
