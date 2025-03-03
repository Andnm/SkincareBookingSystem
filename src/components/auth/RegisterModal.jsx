import React, { useState } from "react";
import "./auth.styles.scss";
import ThirdServicesLogin from "./ThirdServicesLogin";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  getCurrentUserThunk,
  loginThunk,
  registerThunk,
} from "../../redux/actions/userThunk";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selector";
import { Spin } from "antd";
import { ROLE_MANAGER, ROLE_CUSTOMER } from "../../utils/constants";
import { toastError } from "../../utils/helpers";
import { updateUser } from "../../redux/reducers/userReducer";

const RegisterModal = ({ setIsLoginModal, triggerCancel }) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    gender: "Male",
    confirmPassword: "",
  });
  const userData = useSelector(userSelector);

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.warning("Re-enter wrong password");
      return;
    }

    const data = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      role: ROLE_CUSTOMER,
      age: 0,
      address: "",
      gender: formData.gender,
    };

    console.log("data: ", data);

    setIsLoading(true);

    try {
      const responseRegister = await dispatch(registerThunk(data));
      if (registerThunk.rejected.match(responseRegister)) {
        toast.error(responseRegister.payload || responseRegister.error.message);
      } else {
        const credentials = {
          email: formData.email,
          password: formData.password,
        };
        const responseLogin = await dispatch(loginThunk(credentials));

        if (loginThunk.rejected.match(responseLogin)) {
          toast.error(responseLogin.payload || responseLogin.error.message);
        } else {
          setFormData({
            fullName: "",
            phone: "",
            email: "",
            password: "",
            gender: "Male",
            confirmPassword: "",
          });
          triggerCancel();
        }
      }
    } catch (error) {
      console.log("error: ", error);
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="px-6 w-full">
        <div className="flex justify-end">
          <button className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <h2 className="text-center text-2xl font-bold text-blue-800 mb-6">
          REGISTER NEW ACCOUNT
        </h2>
        <form>
          <div className="mb-4">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Fullname"
              type="text"
              style={{ borderColor: "#E4E4E7" }}
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Phone number"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              style={{ borderColor: "#E4E4E7" }}
              value={formData.phone}
              onChange={(e) => {
                let numericValue = e.target.value.replace(/\D/g, "");
                if (numericValue.startsWith("0") && numericValue.length > 10) {
                  numericValue = numericValue.slice(0, 10);
                } else if (
                  numericValue.startsWith("84") &&
                  numericValue.length > 11
                ) {
                  numericValue = numericValue.slice(0, 11);
                }
                setFormData({ ...formData, phone: numericValue });
              }}
            />
          </div>

          <div className="mb-4">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Email"
              type="text"
              style={{ borderColor: "#E4E4E7" }}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <div
              className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              style={{ borderColor: "#E4E4E7" }}
            >
              <div className="flex flex-row items-center gap-16">
                <label className="text-gray-500">Gender</label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span>Female</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span>Other</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 relative">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              style={{ borderColor: "#E4E4E7" }}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <div className="mb-4 relative">
            <input
              className="w-full px-4 py-4 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              style={{ borderColor: "#E4E4E7" }}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <div className="mb-2 mt-10">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleRegister();
              }}
              className={`cursor-pointer w-full bg-blue-800 text-white py-4 font-semibold hover:bg-blue-900 disabled:bg-gray-400 ${
                isLoading ? "disabled:cursor-wait" : ""
              } `}
              disabled={isLoading}
            >
              <Spin spinning={isLoading} />
              Sign up
            </button>
          </div>

          <div className="text-center mb-4 flex justify-center">
            <p>Already have an account? </p>

            <button
              className="cursor-pointer hover:underline font-semibold ml-2"
              onClick={() => setIsLoginModal(true)}
              style={{ color: "#618BC9" }}
            >
              Login
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <div className="px-2 text-gray-500 " style={{ color: "#A0A1A4" }}>
            Continue with
          </div>
          <hr className="flex-grow border-gray-300" />
        </div>

        <ThirdServicesLogin
          triggerCancel={triggerCancel}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};

export default RegisterModal;
