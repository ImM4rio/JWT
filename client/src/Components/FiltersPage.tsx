import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchParamsHandler from '../Hooks/useSearchParamsHandler';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  availability: 'in-stock' | 'out-of-stock';
}

const FiltersPage: React.FC = () => {

  const navigate = useNavigate();

  const [data, setData] = useState<Product[]>([]);
  const [formText, setFormText] = useState<string>('');
  const { searchParams, updateSearchParams, getSearchParam } = useSearchParamsHandler();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [availability, setAvailability] = useState<'in-stock' | 'out-of-stock'>('in-stock');


  const fetchDataWithFilters = async (filters: { category: string; search: string }) => {
    const simulatedData: Product[] = [
      { id: 1, name: 'Product 1', category: filters.category, price: 150, availability: 'in-stock' },
      { id: 2, name: 'Product 2', category: filters.category, price: 200, availability: 'out-of-stock' },
    ];

    const filteredData = simulatedData.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1] && item.availability === availability
    );
    if (filteredData) setData(filteredData);
  };

  const handleNavigate = () => {
    navigate({pathname:'/second', search: `?${searchParams.toString()}`})
  }

  useEffect(() => {
    const filters = {
      category: searchParams.get('category') || 'all',
      search: searchParams.get('search') || '',
      price: searchParams.get('price') || ''
    };

    fetchDataWithFilters(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, priceRange, availability]);

  const handleFilterChange = (newCategory: string, newSearch: string) => {
     updateSearchParams({
       category: newCategory,
       search: newSearch || '',
     });
  };

  const handlePriceRangeChange = (from: number, to: number) => {
    setPriceRange([from, to]);
     updateSearchParams({
       price: to > 0 ? to.toString() : '',
     }, true);
  }

  const handleAvailability = (available: string) => {
    setAvailability(available as 'in-stock' | 'out-of-stock');
    updateSearchParams({availability: available});
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      updateSearchParams({
        formText: formText,
      });

    setFormText('');
  };

  return (
    <div>
      <h1>Filter Page</h1>
      <button type='button' onClick={handleNavigate}>
        Second page
      </button>
      <div>
        <label>Category: </label>
        <select
          value={searchParams.get('category') || 'all'}
          onChange={(e) => handleFilterChange(e.target.value, searchParams.get('search') || '')}
        >
          <option value='all'>All</option>
          <option value='electronics'>Electronics</option>
          <option value='books'>Books</option>
        </select>
      </div>

      <div>
        <label>Search: </label>
        <input
          type='text'
          value={searchParams.get('search') || ''}
          onChange={(e) => handleFilterChange(searchParams.get('category') || 'all', e.target.value)}
        />
      </div>

      <div>
        <label>Price Range: </label>
        <input
          type='range'
          min='0'
          max='1000'
          value={searchParams.get('price') ?? priceRange[1]}
          onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
        />
        <span>{searchParams.get('price') ?? priceRange[1]}</span>
      </div>

      <div>
        <label>Availability: </label>
        <select value={availability} onChange={(e) => handleAvailability(e.target.value as 'in-stock' | 'out-of-stock')}>
          <option value='in-stock'>In Stock</option>
          <option value='out-of-stock'>Out of Stock</option>
        </select>
      </div>

      <h2>Filtered Data:</h2>
      <ul>
        {data?.map((item: Product) => (
          <li key={item.id}>
            {item.name} - ${item.price} - {item.availability}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input type='text' value={formText} onChange={(e) => setFormText(e.target.value)} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default FiltersPage;
