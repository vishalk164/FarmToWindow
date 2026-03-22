import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerDashboard = () => {
  const { api } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: 'Vegetables', quantity: '', imageUrl: ''
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async (showLoader = true) => {
      if (showLoader) setLoading(true);
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products/farmer'),
          api.get('/orders/all') // In a real app, this would be an endpoint filtering orders by farmer's products
        ]);
        if (isMounted) {
          setProducts(productsRes.data);
          setOrders(ordersRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted && showLoader) setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData(false);
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [api]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', newProduct);
      setIsAdding(false);
      setNewProduct({ name: '', description: '', price: '', category: 'Vegetables', quantity: '', imageUrl: '' });
      toast.success('Product added successfully!');
      // Force an immediate refresh
      const productsRes = await api.get('/products/farmer');
      setProducts(productsRes.data);
    } catch (err) {
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete product?')) {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted.');
      const productsRes = await api.get('/products/farmer');
      setProducts(productsRes.data);
    }
  };

  const updateOrderStatus = async (id, status) => {
    await api.put(`/orders/${id}/status?status=${status}`);
    toast.success(`Order marked as ${status}`);
    const ordersRes = await api.get('/orders/all');
    setOrders(ordersRes.data);
  };

  if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Farmer Dashboard</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-2 gap-4">
          <input required type="text" placeholder="Product Name" className="border p-2 rounded"
            value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
            
          <select className="border p-2 rounded" value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Grains</option>
          </select>

          <input required type="number" placeholder="Price (₹)" className="border p-2 rounded"
            value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
            
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-bold mb-1">Available Stock</label>
              <input type="number" required min="1"
                className="w-full border p-2 rounded focus:ring-2 outline-none"
                value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-bold mb-1">Unit</label>
              <select 
                className="w-full border p-2 rounded focus:ring-2 outline-none bg-white"
                value={newProduct.unit} onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
              >
                <option value="kg">kg</option>
                <option value="grams">grams</option>
                <option value="pieces">pieces</option>
                <option value="dozens">dozens</option>
                <option value="liters">liters</option>
                <option value="bundles">bundles</option>
                <option value="boxes">boxes</option>
              </select>
            </div>
          </div>
          <input type="text" placeholder="Image URL (optional)" className="border p-2 rounded col-span-2"
            value={newProduct.imageUrl} onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})} />
            
          <textarea placeholder="Description" className="border p-2 rounded col-span-2"
            value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />

          <button type="submit" className="bg-green-600 text-white py-2 rounded-lg col-span-2">Save Product</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package /> My Inventory
          </h2>
          <div className="space-y-4">
            {products.length === 0 && <p className="text-gray-500">No products listed yet.</p>}
            {products.map(p => (
              <div key={p.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-semibold text-lg">{p.name} <span class="text-sm text-gray-500 font-normal">({p.category})</span></h3>
                  <p className="text-gray-600">₹{p.price} / {p.unit || 'kg'} | Stock: {p.quantity} {p.unit || 'kg'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            📦 Recent Orders
          </h2>
          <div className="space-y-4">
            {orders.length === 0 && <p className="text-gray-500">No recent orders.</p>}
            {orders.map(o => (
              <div key={o.id} className="border p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">Order #{o.id}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-bold
                      ${o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {o.status}
                    </span>
                  </div>
                  <span className="font-bold text-green-700">₹{o.totalAmount}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Customer: {o.customerName} | {o.shippingAddress}</p>
                
                {o.status === 'PENDING' && (
                  <button onClick={() => updateOrderStatus(o.id, 'SHIPPED')} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
                    Mark as Shipped
                  </button>
                )}
                {o.status === 'SHIPPED' && (
                  <button onClick={() => updateOrderStatus(o.id, 'DELIVERED')} className="text-sm bg-green-600 text-white px-3 py-1 rounded">
                    Mark as Delivered
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
