import { useSearchParams } from 'react-router-dom';
import UserHomePage from '../components/profile/UserHomePage';
import UserProfileForm from '../components/profile/UserProfileForm';
import ContentWrapper from '../components/ui/ContentWrapper';
const UserProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const showLogin = searchParams.get('isform') === 'true';

  const changeForm = (boolean) => {
    setSearchParams({ isform: boolean }, { replace: true });
  };

  return (
    <ContentWrapper className={'my-3'}>
      <div className=" mx-auto  font-sans">
        {showLogin ? (
          <UserProfileForm changeForm={changeForm} />
        ) : (
          <UserHomePage changeForm={changeForm} />
        )}
      </div>
    </ContentWrapper>
  );
};

export default UserProfile;
