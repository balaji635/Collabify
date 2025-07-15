// pages/PostTeam.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

export default function PostTeam() {
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
      const res = await axios.post(
        `${backendURL}/problem/create-problem`,
        payload,
        { withCredentials: true }
      );
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
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Failed to post team.');
    }
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
  );
}
