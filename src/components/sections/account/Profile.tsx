import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonState, setUser } from "@/toolkit/common/common.slice";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { customersApi } from "@/toolkit/customers/customers.api";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(commonState);
  const { useUpdateProfileMutation } = customersApi;
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_name", "profile");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}media/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "X-Nhost-Bucket-Id": "public",
        },
      }
    );
    return response?.data?.Location;
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        image_url: user?.image_url || "",
      }).unwrap();

      // Update Redux state with new user data
      if (user) {
        dispatch(
          setUser({
            data: {
              user: {
                ...user,
                first_name: formData.firstName,
                last_name: formData.lastName,
              },
              access_token: { token },
            },
          })
        );
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await handleFileUpload(file);
        if (imageUrl && user) {
          await updateProfile({
            first_name: formData.firstName,
            last_name: formData.lastName,
            image_url: imageUrl,
          }).unwrap();

          dispatch(
            setUser({
              data: {
                user: {
                  ...user,
                  image_url: imageUrl,
                },
                access_token: { token },
              },
            })
          );

          toast.success("Profile picture updated successfully");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to update profile picture");
      }
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div
              className="relative cursor-pointer group"
              onClick={handleImageClick}
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src={user?.image_url || "/vrun-logo.jpg"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <Camera className="text-white opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Click to upload new profile picture
            </p>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
