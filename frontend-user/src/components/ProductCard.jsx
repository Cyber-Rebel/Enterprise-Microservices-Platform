import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.cart);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      dispatch(addToCart({ productId: product._id, quantity: 1 }));
    }
  };

  const imageUrl = product.images?.[0]?.url || product.images?.[0]?.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image';
  const price = product.price?.amount || product.price || 0;
  const currency = product.price?.currency || 'INR';

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        
        {/* Quick Add Button */}
        {isAuthenticated && (
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="absolute bottom-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-indigo-600 hover:text-white disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-gray-800 font-semibold text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">
            {currency === 'INR' ? '₹' : '$'}{price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            In Stock
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
