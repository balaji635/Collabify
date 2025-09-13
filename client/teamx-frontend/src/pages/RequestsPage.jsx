import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function RequestsPage() {
  const { backendURL, socket, setUnreadRequests } = useContext(AppContext);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${backendURL}/chat/requests`, { withCredentials: true });
      if (res.data.success) setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch requests");
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await axios.post(
        `${backendURL}/chat/requests/${id}/accept`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setRequests(prev => prev.filter(r => r._id !== id));
        toast.success("Request accepted! Chat created.");
        socket?.emit("requestAction", { requestId: id, action: "accept" });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.post(
        `${backendURL}/chat/requests/${id}/reject`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setRequests(prev => prev.filter(r => r._id !== id));
        toast.success("Request rejected");
        socket?.emit("requestAction", { requestId: id, action: "reject" });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reject request");
    }
  };

  useEffect(() => {
    fetchRequests();
    setUnreadRequests(0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 py-6">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-bold text-slate-200 mb-6 text-center">
          Team Requests
        </h2>

        {requests.length === 0 ? (
          <div className="text-center text-slate-400 mt-10 text-lg">
            No new requests
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map(r => (
              <div
                key={r._id}
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-xl transition relative"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full z-10">
                  {r.from.name}
                </div>

                {/* Hackathon Post */}
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
                    Skills:{" "}
                    <span className="text-slate-200">
                      {r.post?.skillsRequired?.join(", ") || "N/A"}
                    </span>
                  </p>
                  <p className="text-slate-300 text-sm line-clamp-2">
                    {r.post?.description || "No description"}
                  </p>
                </div>

                {/* Request Info */}
                <div className="mb-4 p-4 bg-slate-700 rounded-lg">
                  <p className="text-slate-200 text-sm">
                    <span className="font-semibold">{r.from.name}</span> wants to join
                  </p>
                  <p className="text-slate-400 text-xs mt-1">Email: {r.from.email}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(r._id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(r._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
