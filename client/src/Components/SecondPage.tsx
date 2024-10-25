import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SecondPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <div>
      <h1>Second Page</h1>
      <p>Category: {searchParams.get('category') || 'all'}</p>
      <p>Search: {searchParams.get('search') || ''}</p>
      <p>Price Range: {searchParams.get('price') || '0-1000'}</p>
      <p>Availability: {searchParams.get('availability') || 'in-stock'}</p>
    </div>
  );
};

export default SecondPage;
