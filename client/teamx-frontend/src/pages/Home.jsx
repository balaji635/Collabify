import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { backendURL, userData, socket } = useContext(AppContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]); // store sent requests

  const navigate = useNavigate();

  // fetch all hackathon posts
  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/problem/all`, { withCredentials: true });
      if (res.data.success) setProblems(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  // fetch sent requests from backend
  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(`${backendURL}/chat/sent-requests`, { withCredentials: true });
      if (res.data.success) {
        // store postId for which requests were sent
        setSentRequests(res.data.requests.map(r => r.post._id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // FIXED: send request with correct data
  const handleRequest = async (post) => {
    // check if already sent request to this user
    if (sentRequests.includes(post.createdBy._id)) return;

    try {
      const res = await axios.post(`${backendURL}/chat/request`,
        { postId: post._id }, // Send postId instead of "to"
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Request sent!");
        setSentRequests(prev => [...prev, post.createdBy._id]); // Add userId to sent requests
        // Notify via socket
        if (socket) {
          socket.emit("newRequest", post.createdBy._id);
        }
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to send request";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchProblems();
    fetchSentRequests();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!problems.length) return <div className="text-center mt-10">No posts yet.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Hackathon Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {problems.map((p) => {
          const isOwner = userData?._id === p.createdBy._id;
          const alreadyRequested = sentRequests.includes(p.createdBy._id); // Check by userId

          return (
            <div
              key={p._id}
              className={`p-5 rounded-lg shadow-md ${isOwner ? "border-2 border-blue-400" : "border border-gray-100"}`}
            >
              <h3 className="text-xl font-semibold text-blue-600">{p.hackathonName}</h3>
              <p>Team: {p.teamName}</p>
              <p>Members Required: {p.membersRequired}</p>
              <p>Deadline: {new Date(p.registrationDeadline).toLocaleDateString()}</p>
              <p>Skills: {p.skillsRequired.join(", ")}</p>
              <p className="mt-2">{p.description}</p>
              <p className="text-xs mt-2">Posted by: {p.createdBy.name}</p>

              {!isOwner && (
                <button
                  onClick={() => handleRequest(p)}
                  disabled={alreadyRequested}
                  className={`mt-3 w-full py-2 rounded text-white ${alreadyRequested ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  {alreadyRequested ? "Request Sent" : "Request"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}