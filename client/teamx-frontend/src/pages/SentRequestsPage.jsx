import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function SentRequestsPage() {
  const { backendURL } = useContext(AppContext);
  const [sentRequests, setSentRequests] = useState([]);

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(`${backendURL}/chat/sent-requests`, { withCredentials: true });
      if (res.data.success) setSentRequests(res.data.requests);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch sent requests");
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;

    try {
      const res = await axios.delete(`${backendURL}/chat/requests/${id}`, { withCredentials: true });
      if (res.data.success) {
        setSentRequests(prev => prev.filter(r => r._id !== id));
        toast.success("Request cancelled");
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to cancel request";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchSentRequests();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Sent Requests
      </h2>
      
      {sentRequests.length === 0 ? (
        <div className="text-center text-gray-500 mt-10 text-lg">
          You haven't sent any requests yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sentRequests.map(r => (
            <div
              key={r._id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-100 hover:shadow-lg transition relative"
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                Sent to {r.to.name}
              </div>

              {/* Post Details - Same as Home page */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-blue-600">
                  {r.post?.hackathonName || "Unknown Hackathon"}
                </h3>
                <p className="text-gray-700 font-medium mb-2">
                  Team: {r.post?.teamName || "Unknown Team"}
                </p>
                <p className="text-sm text-gray-600">
                  Members Required:{" "}
                  <span className="font-medium">{r.post?.membersRequired || "N/A"}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Deadline:{" "}
                  <span className="font-medium">
                    {r.post?.registrationDeadline 
                      ? new Date(r.post.registrationDeadline).toLocaleDateString()
                      : "N/A"
                    }
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Skills:{" "}
                  <span className="font-medium text-gray-800">
                    {r.post?.skillsRequired?.join(", ") || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {r.post?.description || "No description available"}
                </p>
              </div>

              {/* Request Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Request sent to <span className="font-semibold text-gray-800">{r.to.name}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Email: {r.to.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: <span className="font-medium text-orange-600">Pending</span>
                </p>
              </div>

              {/* Cancel Button */}
              <div className="mt-4">
                <button
                  onClick={() => cancelRequest(r._id)}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  <span>✕</span>
                  Cancel Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}