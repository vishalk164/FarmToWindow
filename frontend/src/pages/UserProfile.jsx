import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

const UserProfile = () => {
  const { api, user } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile({ name: data.name || '', phone: data.phone || '', address: data.address || '' });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [api]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', profile);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b">
          <div className="bg-green-100 p-4 rounded-full text-green-700">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Address</label>
            <textarea 
              value={profile.address}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              placeholder="Enter your full street address..."
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
