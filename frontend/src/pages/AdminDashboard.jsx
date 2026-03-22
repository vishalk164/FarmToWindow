import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, DollarSign, ShoppingBag, Wheat, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { api } = useAuth();
  const [stats, setStats] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);
        const usersRes = await api.get('/admin/users');
        setUserList(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [api]);

  const handleDeleteUser = async (id) => {
    if(!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUserList(userList.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading admin panel...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Control Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><Users size={28} /></div>
          <div><p className="text-gray-500 text-sm font-medium">Total Users</p><h3 className="text-3xl font-black">{stats.totalUsers}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-xl text-green-600"><DollarSign size={28} /></div>
          <div><p className="text-gray-500 text-sm font-medium">Revenue (₹)</p><h3 className="text-3xl font-black">{stats.totalRevenue || 0}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-100 p-4 rounded-xl text-orange-600"><ShoppingBag size={28} /></div>
          <div><p className="text-gray-500 text-sm font-medium">Total Orders</p><h3 className="text-3xl font-black">{stats.totalOrders}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-xl text-purple-600"><Wheat size={28} /></div>
          <div><p className="text-gray-500 text-sm font-medium">Products Listed</p><h3 className="text-3xl font-black">{stats.totalProducts}</h3></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold">User Management</h2>
          <div className="text-sm text-gray-500">Farmers: {stats.totalFarmers} | Customers: {stats.totalCustomers}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 font-bold border-b">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {userList.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{u.name}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                      ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        u.role === 'FARMER' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'ADMIN' && (
                      <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
