import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerCart = () => {
  const { api } = useAuth();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.productId !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const placeOrder = async () => {
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    if (!address) { toast.error('Please provide a shipping address'); return; }

    try {
      const orderData = {
        shippingAddress: address,
        items: cart.map(item => ({ productId: item.productId, quantity: item.cartQuantity || item.quantity }))
      };
      
      await api.post('/orders', orderData);
      setCart([]);
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');
      navigate('/customer/orders'); // Route to tracking
    } catch (err) {
      toast.error('Failed to place order. ' + (err.response?.data?.message || err.message));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * (item.cartQuantity || item.quantity)), 0);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <ShoppingBag /> Your Cart
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
              Your cart is empty.
              <button 
                onClick={() => navigate('/customer')}
                className="block mx-auto mt-4 text-green-600 hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm">Sold by: {item.farmerName}</p>
                  <p className="text-green-700 font-bold mt-1">₹{item.price} x {item.cartQuantity || item.quantity} {item.unit || 'kg'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">₹{item.price * (item.cartQuantity || item.quantity)}</span>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
            <h2 className="text-xl font-bold border-b pb-4 mb-4">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Items ({cart.length})</span>
              <span className="font-semibold">₹{total}</span>
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-green-700">₹{total}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
              <textarea 
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="3"
                placeholder="Enter complete delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>

            <button 
              onClick={placeOrder}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors
                ${cart.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCart;
