import React from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillApple } from "react-icons/ai";
import { CiFacebook } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getCurrentUserThunk,
  loginGoogleThunk,
} from "../../redux/actions/userThunk";
import { handleActionNotSupport } from "../../utils/helpers";
import {
  auth,
  googleProvider,
  signInWithPopup,
} from "../../services/configFirebase";

const ThirdServicesLogin = ({ triggerCancel, isLoading, setIsLoading }) => {
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const googleToken = await result.user.getIdToken();

      const response = await dispatch(loginGoogleThunk({ googleToken: googleToken }));
      if (loginGoogleThunk.rejected.match(response)) {
        toast.error(response.payload || "Login thất bại");
      } else {
        const getCurrentUserAction = await dispatch(getCurrentUserThunk());
        if (getCurrentUserThunk.rejected.match(getCurrentUserAction)) {
          toast.error(response.payload || response.error.message);
        } else {
          toast.success("Login thành công");
          triggerCancel();
        }
      }
    } catch (error) {
      toast.error("Login Google thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-4 justify-center">
      <button
        className="flex items-center px-8 py-3 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
        onClick={handleActionNotSupport}
      >
        <CiFacebook className="text-blue-600" size={27} />
      </button>

      <button
        className="flex items-center px-8 py-3 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
        onClick={handleGoogleLogin}
      >
        <FcGoogle size={25} />
      </button>

      <button
        className="flex items-center px-8 py-3 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
        onClick={handleActionNotSupport}
      >
        <AiFillApple size={27} />
      </button>
    </div>
  );
};

export default ThirdServicesLogin;
