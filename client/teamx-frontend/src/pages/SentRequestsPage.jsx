import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function SentRequestsPage() {
  const { backendURL } = useContext(AppContext);
  const [sentRequests, setSentRequests] = useState([]);

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(`${backendURL}/chat/sent-requests`, {
        withCredentials: true,
      });
      if (res.data.success) setSentRequests(res.data.requests);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch sent requests");
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;

    try {
      const res = await axios.delete(`${backendURL}/chat/requests/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSentRequests((prev) => prev.filter((r) => r._id !== id));
        toast.success("Request cancelled");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to cancel request");
    }
  };

  useEffect(() => {
    fetchSentRequests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 py-6 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-bold text-slate-200 mb-6 text-center">
          Your Sent Requests
        </h2>

        {sentRequests.length === 0 ? (
          <div className="text-center text-slate-400 mt-10 text-lg">
            You haven't sent any requests yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {sentRequests.map((r) => (
              <div
                key={r._id}
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-xl transition relative"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full z-10">
                  Sent to {r.to.name}
                </div>

                {/* Post Details */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-200 mb-2">
                    {r.post?.hackathonName || "Unknown Hackathon"}
                  </h3>
                  <p className="text-slate-400 text-sm mb-1">
                    Team: <span className="text-slate-200">{r.post?.teamName || "N/A"}</span>
                  </p>
                  <p className="text-slate-400 text-sm mb-1">
                    Members:{" "}
                    <span className="text-slate-200">{r.post?.membersRequired || "N/A"}</span>
                  </p>
                  <p className="text-slate-400 text-sm mb-1">
                    Deadline:{" "}
                    <span className="text-slate-200">
                      {r.post?.registrationDeadline
                        ? new Date(r.post.registrationDeadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </p>
                  <p className="text-slate-400 text-sm mb-2">
                    Skills{" "}
                    <span className="text-slate-200">
                      {r.post?.skillsRequired?.join(", ") || "N/A"}
                    </span>
                  </p>
                  <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                    {r.post?.description || "No description available"}
                  </p>
                </div>

                {/* Request Info */}
                <div className="mb-4 p-4 bg-slate-700 rounded-lg">
                  <p className="text-slate-200 text-sm">
                    Request sent to <span className="font-semibold">{r.to.name}</span>
                  </p>
                  <p className="text-slate-400 text-xs mt-1">Email: {r.to.email}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Status: <span className="font-medium text-orange-400">Pending</span>
                  </p>
                </div>

                {/* Cancel Button */}
                <button
                  onClick={() => cancelRequest(r._id)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded-lg shadow-md shadow-red-900/40 hover:from-red-500 hover:to-red-600 transition flex items-center justify-center gap-2"
                >
                  <span>✕</span>
                  Cancel Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
