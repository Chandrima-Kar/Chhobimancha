// src/components/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserCard from "../../components/userCard";
import axiosInstance from "../../config/axiosInstance";
import Preloader from "../../components/PreLoader/PreLoader";
import { toast } from "sonner";

const AdminUsers = () => {
  const [AdminUsers, setAdminUsers] = useState([]);
  const [NonAdminUsers, setNonAdminUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const CurrUser = useSelector((state) => state.user.userInfo);
  const amOwner = CurrUser.isOwner;
  console.log(amOwner);

  const GetAllUsers = async () => {
    try {
      const response = await axiosInstance.get(`/users`);
      const tempUserData = response.data;
      setLoading(true);

      const admins = tempUserData.filter((user) => {
        return user.isAdmin && !user.isOwner;
      });
      const non_admins = tempUserData.filter((user) => {
        return !user.isAdmin;
      });

      setAdminUsers(admins);
      setNonAdminUsers(non_admins);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setIsInitialLoad(false);
    }
    // finally {
    //   setLoading(false);
    //   setIsInitialLoad(false);
    // }
  };

  useEffect(() => {
    GetAllUsers();
  }, []);

  const handleAdminAuthorize = async (userId, userAdminStatus) => {
    if (!amOwner) return;
    try {
      const response = await axiosInstance.put(`/users/${userId}`, {
        isAdmin: !userAdminStatus,
      });
      toast.success("Admin authorization updated successfully");
      GetAllUsers();
    } catch (error) {
      console.error(error);
      toast.error("Error updating admin authorization");
    }
  };

  const handleDeleteClick = async (userId) => {
    if (!amOwner) return;
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      toast.success("User deleted successfully");
      GetAllUsers();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting user");
    }
  };

  if (loading) {
    return <Preloader setLoading={setLoading} />;
  }
  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Admin Users */}
      {amOwner && (
        <>
          <h1 className="text-xl sm:text-4xl lg:text-5xl font-bold text-primary_text py-4 font-montserrat">
            All Admins
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {AdminUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                amOwner={amOwner}
                onToggleAuthorizeAdmin={handleAdminAuthorize}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        </>
      )}
      {/* Non Admin Users */}
      <h1 className="text-xl sm:text-4xl lg:text-5xl font-bold text-primary_text py-4 font-montserrat">
        All Users
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {NonAdminUsers.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            amOwner={amOwner}
            onToggleAuthorizeAdmin={handleAdminAuthorize}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
