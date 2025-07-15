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
        const res = await axios.get(
          `${backendURL}/problem/all`,
          { withCredentials: true }
        );
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

  if (loading) return <p>Loading...</p>;

  if (!Array.isArray(problems) || problems.length === 0) {
    return <p>No posts yet.</p>;
  }

  return (
    <div>
      <h2>All Hackathon Posts</h2>
      <ul>
        {problems.map((p) => (
          <li key={p._id}>
            <strong>{p.hackathonName}</strong> — {p.teamName}
            <br />
            Members: {p.membersRequired}
            <br />
            Deadline:{" "}
            {new Date(p.registrationDeadline).toLocaleDateString()}
            <br />
            Skills: {p.skillsRequired.join(", ")}
            <br />
            {p.description}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
