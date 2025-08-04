import preloader from '/preloader.gif';

export default function Preloader() {
  return (
    <div className=" w-full h-full fixed top-0 left-0 bg-transparent z-50 flex justify-center items-center">
      <img className="size-36" src={preloader} alt="" />
    </div>
  );
}
