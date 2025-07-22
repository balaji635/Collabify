import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function Home() {
  const { backendURL } = useContext(AppContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${backendURL}/problem/all`, {
          withCredentials: true,
        });
        console.log("Fetch /problem/all response:", res.data);
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
    })();
  }, [backendURL]);

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
        {problems.map((p) => (
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
          </div>
        ))}
      </div>
    </div>
  );
}
