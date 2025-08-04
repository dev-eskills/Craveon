import { useAuthStore } from '../../stores/authStore';
import Input from '../ui/Input';
import { useUpdateUserDetail, useUserDetail } from '../../hooks/useAddAddress';
import useFormData from '../../hooks/useFormData';
import toast from 'react-hot-toast';
import BackButton from '../ui/BackButton';
import Spinner from '../ui/Spinner';

const UserProfileForm = ({ changeForm }) => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { data: userDetail } = useUserDetail(user.id);
  const initialState = {
    name: userDetail?.user?.name || '',
    email: userDetail?.user?.email || '',
    number: userDetail?.user?.number || '',
  };

  const { formData, handleChange } = useFormData(initialState);

  const { mutate: updateUserDetail, isPending } = useUpdateUserDetail({
    onSuccess: (data) => {
      if (data && data.data) {
        updateUser({
          user: {
            ...userDetail,
            ...formData,
          },
        });
      }

      changeForm(false);
      toast.success('Detail Updated Successfully');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userDetail?.user?._id) {
      updateUserDetail({ id: userDetail?.user?._id, formData });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md">
      <BackButton text={'Personal Information'} />
      <p className="text-sm text-gray-500">Use a permanent address where you can receive mail.</p>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <Input label="Name" type="text" name="name" value={formData.name} onChange={handleChange} />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label="Number"
          type="tel"
          name="number"
          value={formData.number}
          onChange={handleChange}
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-1 text-gray-600 cursor-pointer hover:shadow hover:border border-gray-100 rounded-sm hover:bg-gray-50  transition "
            onClick={() => changeForm('false')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#ff6900] text-white rounded-md ml-2 cursor-pointer"
          >
            {isPending ? <Spinner /> : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
