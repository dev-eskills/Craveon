import { Link } from 'react-router-dom';

function Category({ img, title, id }) {
  return (
    <Link
      to={`/user/category/${id}?category=${encodeURIComponent(title)}`}
      className="flex flex-col items-center gap-y-2.5 cursor-pointer"
    >
      <div className=" rounded-full">
        {/* <Suspense fallback={'img loading'}> */}
        <img src={img} alt="ctg" className="rounded-full size-16 object-cover" />
        {/* </Suspense> */}
      </div>
      <h3 className="text-xs sm:text-sm font-normal text-nowrap line-clamp-1  leading-">{title}</h3>
    </Link>
  );
}

export default Category;
