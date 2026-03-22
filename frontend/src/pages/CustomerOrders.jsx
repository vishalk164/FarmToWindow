import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package } from 'lucide-react';

const CustomerOrders = () => {
  const { api } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [api]);

  if (loading) return <div className="text-center mt-10">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <Package /> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order ID: #{order.id}</p>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-green-700 mt-1">Total: ₹{order.totalAmount}</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold mb-3">Items:</h4>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.quantity}x {item.productName}</span>
                      <span className="text-gray-600">₹{item.price} each</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-sm text-gray-700">Shipping To:</h4>
                  <p className="text-sm text-gray-600 mt-1">{order.shippingAddress}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
