import React from 'react';
import { Link } from 'react-router-dom';

function Add2CartBtn({ link, className, product }) {
  return (
    <button
      className={`w-full text-white py-2 px-4 bg-black duration-500 transition-colors cursor-pointer hover:bg-orange-600 ${className}`}
      onClick={() => console.log(`Added ${name} to cart`)}
    >
      <Link to={link}>Add to Cart</Link>
    </button>
  );
}

export default Add2CartBtn;
