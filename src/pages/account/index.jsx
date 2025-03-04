import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selector";
import AccountLayout from "../../components/layout/AccountLayout";
import { Spin } from "antd";
import { generateFallbackAvatar } from "../../utils/helpers";

const Account = () => {
  const dispatch = useDispatch();
  const userData = useSelector(userSelector);
  const fileInputRef = useRef(null);
  console.log("userData: ", userData);

  const [formData, setFormData] = useState({
    fullName: userData?.user?.fullName || "",
    email: userData?.user?.email || "",
    phone: userData?.user?.phone || "",
    address: userData?.user?.address || "",
    avatar_url: userData?.user?.avatar_url || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   setIsLoading(true);

    //   let uploadedImageUrl = formData.avatar_url;

    //   if (selectedImage) {
    //     uploadedImageUrl = await handleUploadToFirebase(
    //       selectedImage,
    //       "avatars_FO"
    //     );
    //   }

    //   const updateData = {
    //     name: formData.fullName,
    //     email: formData.email,
    //     phone: formData.phone,
    //     address: formData.address,
    //     avatar_url: uploadedImageUrl,
    //   };

    //   const response = await user.updateUserProfile(
    //     updateData
    //   );

    //   dispatch(
    //     setUserProfile({
    //       ...userData,
    //       ...updateData,
    //     })
    //   );

    //   if (previewUrl) {
    //     URL.revokeObjectURL(previewUrl);
    //   }

    //   toast.success("Profile updated successfully!");
    // } catch (error) {
    //   toastError(error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <AccountLayout>
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <h1 className="text-xl font-medium mb-6">Personal information</h1>
        <p className="text-gray-600 mb-6">
          Manage your profile information to keep your account secure
        </p>

        <div className="horizontal-break"></div>

        <div className="flex mt-10">
          <div className="flex-1 pr-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Full name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                  className="col-span-2 p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Email</label>
                <div className="col-span-2 flex items-center">
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full bg-gray-100 text-gray-500 cursor-not-allowed opacity-70"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Phone number</label>
                <div className="col-span-2 flex items-center">
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Address</label>
                <div className="col-span-2 flex items-center">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <div className="col-start-2">
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-8 py-2 rounded transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-lg cursor-pointer"
                    style={{ border: "0.5px" }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="line-break-account"></div>

          <div className="w-48">
            <div className="text-center">
              <div
                className="w-24 h-24 mx-auto mb-4 cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={
                    userData?.user?.avatar_url ??
                    generateFallbackAvatar(userData?.user?.fullName)
                  }
                  alt="avatar"
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover bg-gray-200 overflow-hidden hover:opacity-80 transition-opacity"
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/jpeg,image/png"
                className="hidden"
              />
              <button
                type="button"
                onClick={handleImageClick}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
              >
                Upload photo
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Maximum size 1 MB
                <br />
                Format: JPEG, PNG
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <Spin />}
    </AccountLayout>
  );
};

export default Account;
