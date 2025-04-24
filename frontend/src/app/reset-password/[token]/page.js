import ResetPassword from "@/components/Shared/ResetPassword";
import ProtectedRoute from "@/utils/protectedRoute";

const page = ({ params }) => {
  return (
    <ProtectedRoute>
      <div
        style={{
          background:
            "linear-gradient( 135deg, rgba(0, 0, 0, 0.7) 45%, rgba(0, 0, 0, 0.2)), url('/shared/auth__bg1.png') no-repeat center center/cover",
        }}
        className="lg:min-h-[88.5vh] min-h-[90vh]  lg:px-32 px-6 gap-12  w-full grid lg:grid-cols-1 justify-items-center  place-items-center"
      >
        {/* Left */}
        <div className="w-full sm:w-[80%] md:w-[70%] lg:w-[45%] mx-auto">
          <ResetPassword token={params.token} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default page;
