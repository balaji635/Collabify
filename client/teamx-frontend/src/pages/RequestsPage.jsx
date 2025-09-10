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

  // FIXED: Handle accept properly
  const handleAccept = async (id) => {
    try {
      const res = await axios.post(`${backendURL}/chat/requests/${id}/accept`, {}, { withCredentials: true });
      if (res.data.success) {
        // Remove request from list
        setRequests(prev => prev.filter(r => r._id !== id));
        toast.success("Request accepted! Chat created.");
        
        // Notify via socket if available
        if (socket) {
          socket.emit("requestAction", { requestId: id, action: "accept" });
        }
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to accept request";
      toast.error(errorMsg);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.post(`${backendURL}/chat/requests/${id}/reject`, {}, { withCredentials: true });
      if (res.data.success) {
        // Remove request from list
        setRequests(prev => prev.filter(r => r._id !== id));
        toast.success("Request rejected");
        
        // Notify via socket if available
        if (socket) {
          socket.emit("requestAction", { requestId: id, action: "reject" });
        }
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to reject request";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchRequests();
    setUnreadRequests(0);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Team Requests
      </h2>
      
      {requests.length === 0 ? (
        <div className="text-center text-gray-500 mt-10 text-lg">
          No new requests
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {requests.map(r => (
            <div
              key={r._id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-100 hover:shadow-lg transition relative"
            >
              {/* Request Badge */}
              <div className="absolute top-3 right-3 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                Request from {r.from.name}
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
                  <span className="font-semibold text-gray-800">{r.from.name}</span> wants to join your team
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Email: {r.from.email}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleAccept(r._id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(r._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}