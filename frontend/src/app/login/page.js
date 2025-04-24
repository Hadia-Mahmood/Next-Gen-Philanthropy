import Login from "@/components/Shared/Login";
import ProtectedRoute from "@/utils/protectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <div
        style={{
          background:
            "linear-gradient( 135deg, rgba(0, 0, 0, 0.7) 45%, rgba(0, 0, 0, 0.2)), url('/shared/auth__bg1.png') no-repeat center center/cover",
        }}
        className="lg:min-h-[88.5vh] min-h-[90vh]  lg:px-32 px-6 gap-12  w-full grid lg:grid-cols-2 justify-items-center  place-items-center"
      >
        {/* Left */}
        <div className="col-span-1 ">
          <Login />
        </div>

        {/* Right */}
        <div className="lg:col-span-1 lg:block hidden">
          <div>
            <h1 className="text-4xl font-paralucent font-bold uppercase mb-5 text-[#fff]">
              Empowering Change
            </h1>
            <p className="text-[#fff]">
            
            Join us in our mission to create a more transparent and impactful charitable world. Our platform is designed to educate, inspire, and enable individuals and organizations to contribute effectively to causes that matter. Together, we can make a lasting impact on communities and foster positive change. Sign in to access personalized project updates, track your donations, and become part of a community dedicated to making the world a better place.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default page;
