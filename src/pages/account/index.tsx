"use client";

import React, { useRef, useState } from "react";
import useSelector from "@hooks/use-selector";

import { generateFallbackAvatar, handleUploadToFirebase } from "@utils/helpers";
import AccountLayout from "@layout/AccountLayout";
import { toast } from "react-toastify";
import { toastError } from "@utils/global";
import useDispatch from "@hooks/use-dispatch";
import user from "@services/user";
import { useSession } from "next-auth/react";
import { setUserProfile } from "@slices/user";
import SpinnerLoading from "@components/loading/SpinnerLoading";

const AccountPage = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const userData = useSelector((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    avatar_url: userData?.avatar_url || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      let uploadedImageUrl = formData.avatar_url;

      if (selectedImage) {
        uploadedImageUrl = await handleUploadToFirebase(
          selectedImage,
          "avatars_FO"
        );
      }

      const updateData = {
        name: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        avatar_url: uploadedImageUrl,
      };

      const response = await user.updateUserProfile(
        session?.user.token!,
        updateData
      );

      dispatch(
        setUserProfile({
          ...userData,
          ...updateData,
        })
      );

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccountLayout>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-medium mb-6">My Profile</h1>
        <p className="text-gray-600 mb-6">
          Manage your profile information to secure your account
        </p>

        <div className="horizontal-break"></div>

        <div className="flex mt-10">
          <div className="flex-1 pr-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Name</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
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
                    className="p-2 border rounded w-full"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600">Phone</label>
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
                    className="bg-red-500 text-white px-8 py-2 rounded hover:bg-red-600 cursor-pointer"
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
                    previewUrl ||
                    (userData?.avatar_url === null ||
                    userData?.avatar_url === undefined ||
                    userData?.avatar_url === ""
                      ? generateFallbackAvatar(userData?.email!)
                      : userData?.avatar_url)
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
                Select Image
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Maximum file size 1 MB
                <br />
                Format: JPEG, PNG
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <SpinnerLoading />}
    </AccountLayout>
  );
};

export default AccountPage;
