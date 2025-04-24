import { aboutServicesData } from "@/app/data";

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="border rounded shadow-md p-6 max-w-sm mx-auto">
      <div className="flex justify-center mb-4">
        {/* Icon container */}
        <div className="rounded-full bg-[#32A632] p-3">
          <span className="text-[#fff] text-[35px]">{icon}</span>
        </div>
      </div>
      <h1 className="font-semibold mb-4 text-lg text-center text-[#182822] hover:text-[#f29620] transition duration-500 ease-in-out cursor-pointer">
        {title}
      </h1>
      <p className="text-center text-gray-600">{description}</p>
    </div>
  );
};

const Welcome = () => {
  return (
    <div className="w-full pt-10 md:pt-24 lg:pb-16 px-4 md:px-10 font-poppins bg-[#f7f9f8]">
      <h1 className="font-paralucent text-[27px] md:text-4xl mt-1 mb-3 text-center text-[#182822] leading-normal">
        How it works?
      </h1>

      <div className="py-12 w-full">
        <div className="flex flex-wrap  justify-center items-center">
          {aboutServicesData.map((service, index) => (
            <div key={index} className="px-4 mb-8 w-full md:w-1/3">
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
