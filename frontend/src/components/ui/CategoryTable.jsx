import { Pencil, CheckCircle, XCircle } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import Spinner from './Spinner';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';

const CategoryTable = ({ handleEditCategory }) => {
  const { updateCategoryStatusFn, categories, IsCategoryStatus, categoriesLoading } =
    useCategories();
  const user = useAuthStore((state) => state.accessToken);

  const skeletonRows = Array(5).fill(null); // Display 5 skeleton rows

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-black">
          <tr>
            <th className="p-3 text-left">Logo</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Edit</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {categoriesLoading
            ? skeletonRows.map((_, index) => (
                <tr key={index} className="border-b border-gray-300 animate-pulse">
                  <td className="p-3">
                    <div className="w-10 h-10 rounded-md bg-gray-200" />
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                  </td>
                  <td className="p-3 text-center">
                    <div className="h-6 w-6 mx-auto bg-gray-200 rounded-full" />
                  </td>
                  <td className="p-3 text-center">
                    <div className="h-5 w-5 mx-auto bg-gray-200 rounded" />
                  </td>
                </tr>
              ))
            : categories.map((category) => {
                const isThisCategoryUpdating =
                  IsCategoryStatus && updateCategoryStatusFn.variables === category._id;

                return (
                  <tr key={category._id} className="border-b border-gray-300">
                    <td className="p-3">
                      <img
                        src={category.image?.logo || '/default-logo.png'}
                        alt={category.name}
                        className="w-10 h-10 rounded-md"
                      />
                    </td>
                    <td className="p-3">{category?.name}</td>
                    <td className="p-3">{category?.description}</td>
                    <td className="p-3 text-center flex items-center justify-center">
                      {isThisCategoryUpdating ? (
                        <Spinner />
                      ) : (
                        <button
                          className="focus:outline-none"
                          onClick={() =>
                            updateCategoryStatusFn.mutate(category._id, {
                              onSuccess: () => {
                                toast.success(
                                  category.isActive
                                    ? 'Category Disabled Successfully'
                                    : 'Category Enabled Successfully'
                                );
                              },
                            })
                          }
                        >
                          {category.isActive ? (
                            <CheckCircle className="text-green-500 w-6 h-6" />
                          ) : (
                            <XCircle className="text-red-500 w-6 h-6" />
                          )}
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        className="text-blue-500 hover:text-blue-400"
                        onClick={() => handleEditCategory(category._id)}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;

