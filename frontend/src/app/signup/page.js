import Signup from "@/components/Shared/Signup";
import ProtectedRoute from "@/utils/protectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <div
        style={{
          background:
            "linear-gradient( 135deg, rgba(0, 0, 0, 0.7) 45%, rgba(0, 0, 0, 0.2)), url('/shared/auth__bg1.png') no-repeat center center/cover",
        }}
        className="min-h-[90vh]  lg:px-32 sm:px-20 py-10 px-6 w-full "

        // className="min-h-[90vh] px-32 py-20  w-full "
      >
        <Signup />
      </div>
    </ProtectedRoute>
  );
};

export default page;

