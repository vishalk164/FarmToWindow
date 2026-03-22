import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const { api } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async (showLoader = true) => {
      if (showLoader) setLoading(true);
      try {
        const { data } = await api.get('/products');
        if (isMounted) setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted && showLoader) setLoading(false);
      }
    };
    
    // Initial fetch
    fetchProducts();
    
    // Real-time polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchProducts(false);
    }, 5000);
    
    // Load local cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [api]);

  const addToCart = (product) => {
    const newCart = [...cart];
    const existing = newCart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity < product.quantity) {
        existing.quantity += 1;
      } else {
        toast.error('Max stock reached');
        return;
      }
    } else {
      newCart.push({ 
        productId: product.id, 
        name: product.name,
        price: product.price,
        farmerName: product.farmerName,
        quantity: 1 
      });
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <div className="text-center mt-10">Loading products...</div>;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Fresh from Farm</h1>
          <p className="text-gray-500 mt-1">Directly sourced, 100% natural</p>
        </div>
        <div className="w-1/3">
          <input 
            type="text"
            placeholder="Search products or categories..."
            className="w-full border p-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <Link to={`/customer/product/${product.id}`} className="block relative h-48 bg-gray-100 overflow-hidden group">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
              <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold text-green-700 shadow-sm">{product.category}</span>
            </Link>
            
            <div className="p-4">
              <Link to={`/customer/product/${product.id}`} className="hover:text-green-700">
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-500 mb-3">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="font-black text-xl text-green-700">₹{product.price}</span>
                <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
              </div>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                disabled={product.quantity === 0}
                className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors
                  ${product.quantity > 0 ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
