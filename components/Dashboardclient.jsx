'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, Plus, Pen, Trash2 } from 'lucide-react';

export default function ControlHub() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ active: 0, total: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    rating: '',
    image: '',
  });

  const router = useRouter();

  useEffect(() => {
    fetch('/api/user').then((res) => res.json()).then(setProducts);
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats({ active: data.totalUsers, total: data.totalProducts }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingProduct ? 'PATCH' : 'POST';
    const payload = {
      ...form,
      price: parseFloat(form.price),
      rating: parseFloat(form.rating),
    };
    if (editingProduct) payload.id = editingProduct.id;

    const res = await fetch('/api/product', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const { data } = await res.json();
      setProducts((prev) =>
        editingProduct
          ? prev.map((p) => (p.id === data.id ? data : p))
          : [...prev, data]
      );
      setForm({ name: '', description: '', price: '', category: '', rating: '', image: '' });
      setShowForm(false);
      setEditingProduct(null);
    } else {
      alert('Failed to process entry');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirm removal?')) return;
    const res = await fetch(`/api/product?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert('Deletion failed');
    }
  };

  const handleSignout = async () => {
    await fetch('/api/auth/signout');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">

      <div className="px-6 py-8 max-w-screen-xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold">Home</h1>
          <Button
            onClick={handleSignout}
            className="bg-black text-white hover:bg-gray-800 shadow-md"
          >
            <LogOut className="w-4 h-4 mr-2" /> Exit Console
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: 'Inventory Size', value: products.length },
            { title: 'Users', value: stats.active },
            { title: 'Sold items', value: stats.total },
          ].map((stat) => (
            <Card key={stat.title} className="bg-black text-white border-2 border-black">
              <CardContent className="p-4">
                <div className="text-sm uppercase mb-2 text-gray-400">{stat.title}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>


        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Inventory</h2>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => {
                setShowForm(!showForm);
                setEditingProduct(null);
                setForm({ name: '', description: '', price: '', category: '', rating: '', image: '' });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> {showForm ? 'Cancel' : 'Create Entry'}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6 border-2 border-black">
              <CardContent className="p-4 bg-white">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Title', name: 'name' },
                    { label: 'Details', name: 'description', type: 'textarea' },
                    { label: 'Cost ($)', name: 'price', type: 'number' },
                    { label: 'Category', name: 'category' },
                    { label: 'Stars', name: 'rating', type: 'number' },
                    { label: 'Image Link', name: 'image' },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold uppercase text-black">{label}</label>
                      {type === 'textarea' ? (
                        <textarea
                          value={form[name]}
                          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                          className="w-full border border-black p-2 rounded-md bg-white text-black"
                          rows={3}
                          required
                        />
                      ) : (
                        <input
                          type={type || 'text'}
                          value={form[name]}
                          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                          className="w-full border border-black p-2 rounded-md bg-white text-black"
                          required
                        />
                      )}
                    </div>
                  ))}
                  <div className="col-span-full">
                    <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                      {editingProduct ? 'Update Entry' : 'Submit Entry'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.length === 0 ? (
              <Card className="border-2 border-dashed border-black">
                <CardContent className="text-center p-6 text-gray-500">
                  No entries found. Hit "Create Entry" to begin.
                </CardContent>
              </Card>
            ) : (
              products.map((product) => (
                <Card key={product.id} className="border-2 border-black bg-white hover:shadow-lg transition">
                  <CardContent className="p-4 space-y-3">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    )}
                    <div className="text-lg font-bold">{product.name}</div>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <div className="text-xs text-gray-500">Category: {product.category}</div>
                    <div className="text-xs text-gray-500">Rating: {product.rating} ★</div>
                    <div className="text-xs text-gray-400">User ID: {product.userId}</div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold">${parseFloat(product.price).toFixed(2)}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border-black text-black hover:bg-gray-100"
                          onClick={() => {
                            setEditingProduct(product);
                            setForm({ ...product });
                            setShowForm(true);
                          }}
                        >
                          <Pen className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
