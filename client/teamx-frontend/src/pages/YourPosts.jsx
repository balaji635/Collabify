import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function YourPosts() {
  const { backendURL, userData } = useContext(AppContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/problem/all`, {
        withCredentials: true,
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        const userPosts = res.data.data.filter(
          (p) => p.createdBy?._id === userData?._id
        );
        setProblems(userPosts);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await axios.delete(`${backendURL}/problem/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Post deleted");
        setProblems((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Error deleting post");
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/details/${id}`);
  };

  useEffect(() => {
    if (userData?._id) {
      fetchProblems();
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900 text-slate-400 text-xl">
        Loading...
      </div>
    );
  }

if (!problems || problems.length === 0) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col ">
      <h2 className="text-4xl font-bold text-slate-200 text-center mb-2 w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
        No Post
      </h2>

      <div className="text-center text-slate-400 text-lg">
        Post a team to find members for your hackathon!
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-200 mb-2">
            Your Posts
          </h2>
          <p className="text-slate-400 text-lg">Manage your posts below.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start">
          {problems.map((p) => (
            <div
              key={p._id}
              className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                {p.hackathonName}
              </h3>
              <p className="text-slate-300 font-medium mb-1">
                Team: <span className="text-slate-200">{p.teamName}</span>
              </p>
              <p className="text-slate-400 mb-1">
                Members: <span className="font-medium text-slate-200">{p.membershipRequired || p.membershipRequired}</span>
              </p>
              <p className="text-slate-400 mb-1">
                Deadline:{" "}
                <span className="font-medium text-slate-200">
                  {p.registrationDeadline ? new Date(p.registrationDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                </span>
              </p>
              <p className="text-slate-400 mb-2">
                Skills: <span className="font-medium text-slate-200">{p.skillsRequired?.join(", ")}</span>
              </p>
              <p className="text-slate-300 line-clamp-3 mb-6">
                {p.description}
              </p>
              <div className="text-xs text-slate-500 mb-4">
                Posted on: {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded-lg shadow-md shadow-red-900/40 hover:from-red-500 hover:to-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleViewDetails(p._id)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg shadow-md shadow-blue-900/40 hover:from-blue-500 hover:to-blue-600 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
