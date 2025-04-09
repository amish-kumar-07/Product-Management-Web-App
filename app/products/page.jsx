'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetch('/api/product')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      const matchesPrice =
        (minPrice === '' || parseFloat(product.price) >= parseFloat(minPrice)) &&
        (maxPrice === '' || parseFloat(product.price) <= parseFloat(maxPrice));

      const matchesRating =
        rating === '' || parseFloat(product.rating) >= parseFloat(rating);

      return matchesSearch && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans">
      <h1 className="text-4xl font-bold mb-8 border-b border-black pb-2">🗂️ Product Directory</h1>

      <div className="mb-10 grid grid-cols-1 md:grid-cols-5 gap-4">
        <Input
          type="text"
          placeholder="Search product..."
          className="bg-white border-black text-black placeholder:text-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Min Price"
          className="bg-white border-black text-black placeholder:text-gray-500"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max Price"
          className="bg-white border-black text-black placeholder:text-gray-500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Min Rating"
          min={0}
          max={5}
          className="bg-white border-black text-black placeholder:text-gray-500"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <select
          className="border border-black rounded px-4 py-2 bg-white text-black"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="category">Category</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length === 0 ? (
          <Card className="col-span-full border border-dashed border-black bg-gray-100 text-black">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Package className="h-10 w-10 text-black mb-3" />
              <p className="text-center text-gray-700 text-lg">No products match your search.</p>
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-white border border-black text-black hover:shadow-lg transition"
            >
              <CardContent className="p-5 space-y-2">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded border border-black"
                  />
                )}
                <h3 className="font-semibold text-xl">{product.name}</h3>
                <p className="text-sm text-gray-700">{product.description}</p>
                <div className="text-sm text-gray-600">Category: {product.category}</div>
                <div className="text-sm text-gray-600">Rating: {product.rating} ⭐</div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-lg">${parseFloat(product.price).toFixed(2)}</span>
                  <Button
                    variant="outline"
                    className="border border-black text-black hover:bg-black hover:text-white transition"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
