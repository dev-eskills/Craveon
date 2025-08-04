import { MapPin } from "lucide-react"

const UserAddressConfirm = () => {
  return (
    <>
    <div className="flex flex-col md:items-center w-full">
            <div className="bg-white rounded-2xl p-5">
              <iframe
                className="w-full aspect-video rounded h-64"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.25909,40.477399,-73.700181,40.917577&layer=mapnik"
                allowFullScreen
              ></iframe>
              <button className="bg-orange-500 text-white w-full py-2 rounded-md mt-4 flex items-center justify-center">
                <MapPin className="mr-2" size={16} /> Confirm Location
              </button>
            </div>
          </div>
      
    </>
  )
}

export default UserAddressConfirm
