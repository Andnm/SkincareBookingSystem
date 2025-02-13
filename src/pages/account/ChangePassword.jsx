
import React, { useState } from "react";
import { GrSecure } from "react-icons/gr";
import { message } from "antd";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import AccountLayout from "../../components/layout/AccountLayout";

const ChangePassword = () => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.newPassword !== formData.confirmPassword) {
                message.error("New passwords do not match!");
                return;
            }

            if (formData.newPassword.length < 6) {
                message.error("Password must be at least 6 characters long!");
                return;
            }

            setIsLoading(true);

            // const response = await user.changePassword({
            //     old_password: formData.oldPassword,
            //     new_password: formData.newPassword,
            // });

            toast.success("Thay đổi mật khẩu thành công!");
            toast.success("Vui lòng đăng nhập lại!");

            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (error) {
            // 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AccountLayout>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-xl font-medium mb-6">Change Password</h1>
                <p className="text-gray-600 mb-6">
                    For security, please change your password periodically
                </p>

                <div className="horizontal-break"></div>

                <div className="mt-10 max-w-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label className="block text-gray-600 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 pl-10 border rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your current password"
                                    required
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                                    <GrSecure />
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-gray-600 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 pl-10 border rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your new password"
                                    required
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                                    <GrSecure />
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-gray-600 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 pl-10 border rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Confirm your new password"
                                    required
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                                    <GrSecure />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`bg-red-500 text-white px-8 py-2 rounded hover:bg-red-600 transition-colors
                  ${isLoading
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer"
                                    }`}
                                style={{ border: "0.5px" }}
                            >
                                {isLoading ? "Changing..." : "Change Password"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <p className="text-gray-500 text-sm">
                            * Password must be at least 6 characters long
                        </p>
                        <p className="text-gray-500 text-sm">
                            * For security reasons, you will be logged out after changing your
                            password
                        </p>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
};

export default ChangePassword;
