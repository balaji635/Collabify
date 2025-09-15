import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { backendURL, userData, socket } = useContext(AppContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  // Store request status for each specific post
  const [requestStatus, setRequestStatus] = useState({});

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

  // fetch sent requests from backend and build request status map
  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(`${backendURL}/chat/sent-requests`, { withCredentials: true });
      if (res.data.success) {
        // Build a map of post._id -> request status
        const statusMap = {};
        res.data.requests.forEach(request => {
          statusMap[request.post._id] = {
            sent: true,
            requestId: request._id,
            recipientId: request.to._id
          };
        });
        setRequestStatus(statusMap);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // send request
  const handleRequest = async (post) => {
    // Check if already sent request for this specific post
    if (requestStatus[post._id]?.sent) {
      toast.info("You already have a pending request for this post");
      return;
    }

    try {
      const res = await axios.post(
        `${backendURL}/chat/request`,
        { postId: post._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Request sent!");
        // Update request status for this specific post
        setRequestStatus(prev => ({
          ...prev,
          [post._id]: {
            sent: true,
            requestId: res.data.request._id,
            recipientId: post.createdBy._id
          }
        }));
        
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
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
       
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-200 mb-4">Hackathon Posts</h2>
          <p className="text-slate-500 text-lg">Discover amazing projects and find your next team</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start">
          {problems.map((post) => {
            const isOwner = userData?._id === post.createdBy._id;
            // Check if request was sent for this specific post
            const alreadyRequested = requestStatus[post._id]?.sent || false;

            return (
              <div
                key={post._id}
                className={`group relative bg-slate-800 rounded-2xl p-6 border border-slate-700 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 ${
                  isOwner 
                    ? 'hover:bg-gradient-to-br hover:from-blue-900/80 hover:to-slate-800 hover:border-blue-500/50' 
                    : 'hover:bg-gradient-to-br hover:from-blue-950/30 hover:to-slate-800 hover:border-blue-400/30'
                }`}
              >
                {isOwner && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full z-10">
                    Your Post
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-grow">
                    <div className="mb-4">
                      <h3 className="text-xl text-slate-200 font-bold mb-2 group-hover:text-white transition-colors">
                        {post.hackathonName}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">
                          {post.teamName}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-sm">by {post.createdBy.name}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    <div className="mb-4">
                      <span className="text-slate-400 text-sm block mb-2">Required Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {post.skillsRequired.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-slate-700 group-hover:bg-slate-600 text-slate-300 group-hover:text-slate-200 px-2 py-1 rounded text-xs transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-48 flex flex-col justify-between">
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 text-sm mb-6">
                      <div className="bg-slate-700/50 group-hover:bg-slate-600/50 p-3 rounded-lg transition-colors">
                        <span className="text-slate-400 block">Members needed</span>
                        <p className="text-slate-200 font-medium text-lg">{post.membersRequired}</p>
                      </div>
                      <div className="bg-slate-700/50 group-hover:bg-slate-600/50 p-3 rounded-lg transition-colors">
                        <span className="text-slate-400 block">Deadline</span>
                        <p className="text-slate-200 font-medium">
                          {new Date(post.registrationDeadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {!isOwner && (
                      <button
                        onClick={() => handleRequest(post)}
                        disabled={alreadyRequested}
                        className={`w-full inline-flex justify-center items-center whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-all duration-200 ${
                          alreadyRequested
                            ? 'bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-blue-600 border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white transform hover:scale-105'
                        }`}
                      >
                        <svg 
                          className={`mr-2 ${alreadyRequested ? 'fill-slate-500' : 'fill-current'}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="14"
                        >
                          <path d="M12.82 8.116A.5.5 0 0 0 12 8.5V10h-.185a3 3 0 0 1-2.258-1.025l-.4-.457-1.328 1.519.223.255A5 5 0 0 0 11.815 12H12v1.5a.5.5 0 0 0 .82.384l3-2.5a.5.5 0 0 0 0-.768l-3-2.5ZM12.82.116A.5.5 0 0 0 12 .5V2h-.185a5 5 0 0 0-3.763 1.708L3.443 8.975A3 3 0 0 1 1.185 10H1a1 1 0 1 0 0 2h.185a5 5 0 0 0 3.763-1.708l4.609-5.267A3 3 0 0 1 11.815 4H12v1.5a.5.5 0 0 0 .82.384l3-2.5a.5.5 0 0 0 0-.768l-3-2.5ZM1 4h.185a3 3 0 0 1 2.258 1.025l.4.457 1.328-1.52-.223-.254A5 5 0 0 0 1.185 2H1a1 1 0 0 0 0 2Z" />
                        </svg>
                        <span>{alreadyRequested ? "Request Sent" : "Send Request"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
