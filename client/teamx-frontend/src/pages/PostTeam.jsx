<<<<<<< HEAD
// pages/PostTeam.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

export default function PostTeam() {
=======


import { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';


export default function PostTeam() {
  // console.log("Rendering PostTeam page...");
  const navigate = useNavigate();
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)
  const { backendURL } = useContext(AppContext);
  const [form, setForm] = useState({
    hackathonName: '',
    teamName: '',
    membersRequired: '',
    registrationDeadline: '',
    skillsRequired: '',
    description: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        skillsRequired: form.skillsRequired.split(',').map(s => s.trim()),
      };
<<<<<<< HEAD
      const res = await axios.post(
        `${backendURL}/problem/create-problem`,
        payload,
        { withCredentials: true }
      );
=======
      const res = await axios.post(`${backendURL}/problem/create-problem`, payload, {
        withCredentials: true,
      });
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)
      if (res.data.success) {
        toast.success('Team posted!');
        setForm({
          hackathonName: '',
          teamName: '',
          membersRequired: '',
          registrationDeadline: '',
          skillsRequired: '',
          description: '',
        });
<<<<<<< HEAD
=======

        // ✅ Navigate to home
        navigate('/');
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Failed to post team.');
    }
<<<<<<< HEAD
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post Hackathon Team</h2>
      <input name="hackathonName" value={form.hackathonName} onChange={handleChange} placeholder="Hackathon Name" required/>
      <input name="teamName" value={form.teamName} onChange={handleChange} placeholder="Team Name" required/>
      <input name="membersRequired" type="number" value={form.membersRequired} onChange={handleChange} placeholder="Members Required" required/>
      <input name="registrationDeadline" type="date" value={form.registrationDeadline} onChange={handleChange} required/>
      <input name="skillsRequired" value={form.skillsRequired} onChange={handleChange} placeholder="Skills (comma separated)" required/>
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Project Description" required/>
      <button type="submit">Submit</button>
    </form>
=======
    
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Post Hackathon Team</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="hackathonName"
          value={form.hackathonName}
          onChange={handleChange}
          placeholder="Hackathon Name"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="teamName"
          value={form.teamName}
          onChange={handleChange}
          placeholder="Team Name"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="membersRequired"
          type="number"
          value={form.membersRequired}
          onChange={handleChange}
          placeholder="Members Required"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="registrationDeadline"
          type="date"
          value={form.registrationDeadline}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="skillsRequired"
          value={form.skillsRequired}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Project Description"
          required
          rows={4}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)
  );
}
