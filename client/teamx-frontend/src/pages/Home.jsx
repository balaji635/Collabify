import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

export default function Home() {
  const { backendURL, userData } = useContext(AppContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const handleViewDetails = (id) => {
  navigate(`/details/${id}`);
};
  

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/problem/all`, {
        withCredentials: true,
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        setProblems(res.data.data);
      } else {
        console.error("Unexpected payload:", res.data);
      }
    } catch (err) {
      console.error("Error fetching problems:", err);
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
      console.error("Delete error:", err);
      toast.error("Error deleting post");
    }
  };
  

  useEffect(() => {
    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 text-xl">
        Loading...
      </div>
    );
  }

  if (!Array.isArray(problems) || problems.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        All Hackathon Posts
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {problems.map((p) => {
          const isOwner = userData?._id === p.createdBy._id;
          return (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-100 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-blue-600">
                {p.hackathonName}
              </h3>
              <p className="text-gray-700 font-medium mb-2">
                Team: {p.teamName}
              </p>
              <p className="text-sm text-gray-600">
                Members Required:{" "}
                <span className="font-medium">{p.membersRequired}</span>
              </p>
              <p className="text-sm text-gray-600">
                Deadline:{" "}
                <span className="font-medium">
                  {new Date(p.registrationDeadline).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Skills:{" "}
                <span className="font-medium text-gray-800">
                  {p.skillsRequired.join(", ")}
                </span>
              </p>
              <p className="text-sm text-gray-700 mt-2">{p.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Posted by: {p.createdBy.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(p.updatedAt).toLocaleDateString()}
              </p>

              {isOwner && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewDetails(p._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    </div>
                  )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
