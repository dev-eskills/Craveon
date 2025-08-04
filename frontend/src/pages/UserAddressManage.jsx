import ContentWrapper from '../components/ui/ContentWrapper';
import UserAddressForm from '../components/UserProfileAddress/UserAddressForm';
// import UserAddressConfirm from '../components/UserProfileAddress/UserAddressConfirm';

const AddressForm = () => {
  return (
    <ContentWrapper className="bg-gray-100">
      <div className="bg-gray-100 min-h-screen py-4">
        <div className="grid p-2">
          {/* Address Form */}
          <UserAddressForm />

          {/* Map Section */}
          {/* <UserAddressConfirm /> */}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default AddressForm;
