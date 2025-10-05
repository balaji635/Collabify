import { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function PostTeam({ onPostSuccess }) {
  const navigate = useNavigate();
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
      const res = await axios.post(`${backendURL}/problem/create-problem`, payload, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success('Team posted successfully!');
        setForm({
          hackathonName: '',
          teamName: '',
          membersRequired: '',
          registrationDeadline: '',
          skillsRequired: '',
          description: '',
        });
        if (onPostSuccess) onPostSuccess();
        navigate('/');
      } else {
        console.error("Error posting team:", res.data.message);
        toast.error(res.data.message || 'Failed to post team.');
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast.error(err.response?.data?.message || 'An error occurred while posting the team.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6">
   
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-200 mb-4">Post Hackathon Team</h2>
          <p className="text-slate-500 text-lg">Create your hackathon post and find the perfect teammates</p>
        </div>

      
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Hackathon Name
                </label>
                <input
                  name="hackathonName"
                  value={form.hackathonName}
                  onChange={handleChange}
                  placeholder="e.g., TechCrunch Disrupt 2025"
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Team Name
                </label>
                <input
                  name="teamName"
                  value={form.teamName}
                  onChange={handleChange}
                  placeholder="e.g., Code Crusaders"
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Members Required
                </label>
                <input
                  name="membersRequired"
                  type="number"
                  min="1"
                  max="10"
                  value={form.membersRequired}
                  onChange={handleChange}
                  placeholder="e.g., 3"
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Registration Deadline
                </label>
                <input
                  name="registrationDeadline"
                  type="date"
                  value={form.registrationDeadline}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Skills Required
              </label>
              <input
                name="skillsRequired"
                value={form.skillsRequired}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, Python, UI/UX Design"
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-slate-400 text-sm mt-1">Separate skills with commas</p>
            </div>

            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Project Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your project idea, goals, and what kind of teammates you're looking for..."
                required
                rows={4}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              />
            </div>

           
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                  Post Team
                </span>
              </button>
            </div>
          </form>
        </div>

       
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Need help? Check out our{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              posting guidelines
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
