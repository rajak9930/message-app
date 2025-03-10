import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();


  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/users/${id}`,
          { headers }
        );
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { name, email, phone },
        { headers }
      );
      alert("Profile updated successfully!");
      setUser(data); 
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers,
        });
        localStorage.removeItem("token");
        alert("Account deleted successfully!");
        navigate("/login"); 
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  if (!user)
    return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Phone</label>
          <input
            type="phone"
            className="w-full p-2 border rounded-md"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Update Profile
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white p-2 mt-4 rounded-md"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
