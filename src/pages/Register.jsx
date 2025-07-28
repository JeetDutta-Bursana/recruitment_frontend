import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthServices from '../api/AuthServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TCText from '../assets/TC.txt?raw';
import ProcessTermsText from '../assets/Process_Terms_Graded_New.txt?raw';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [expandedPdf, setExpandedPdf] = useState(null); // 'tc', 'process', or null

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    gender: '',
    qualification: '',
    passoutYear: '',
    skills: ['', '', '', '', ''],
    profilePicture: '',
    resume: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        [field]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthServices.registerUser({ ...formData, agreedToTerms: agreed });
      toast.success('Registration successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-600 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-2xl">
        <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-6 px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-1">Complete Registration</h2>
          <p className="text-sm text-blue-100">Upload your profile picture and resume!</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              'name',
              'email',
              'password',
              'mobile',
              'address',
              'gender',
              'qualification',
              'passoutYear'
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  required
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder={`Enter your ${field}`}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Max 5)</label>
              {formData.skills.map((skill, index) => (
                <input
                  key={index}
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                  placeholder={`Skill ${index + 1}`}
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profilePicture')}
                className="w-full"
              />
              {formData.profilePicture && (
                <img
                  src={formData.profilePicture}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded-full border"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, 'resume')}
                className="w-full"
                required
              />
              {formData.resume && (
                <p className="text-sm text-green-700 mt-1">Resume file attached ✅</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I agree to the{' '}
                <button type="button" className="text-blue-600 underline focus:outline-none" onClick={() => setExpandedPdf(expandedPdf === 'tc' ? null : 'tc')}>Terms & Conditions</button>
                {' '}and{' '}
                <button type="button" className="text-blue-600 underline focus:outline-none" onClick={() => setExpandedPdf(expandedPdf === 'process' ? null : 'process')}>Process Terms</button>
              </label>
            </div>

            {expandedPdf === 'tc' && (
              <div className="w-full my-2 border rounded bg-gray-50 p-4 animate-slide-down max-h-[60vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-lg">Terms & Conditions</span>
                  <button onClick={() => setExpandedPdf(null)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                </div>
                <pre className="whitespace-pre-wrap text-base text-gray-900 font-sans text-left leading-relaxed tracking-normal" style={{fontFamily: 'Segoe UI, Arial, sans-serif', background: 'none', padding: 0, margin: 0}}>{TCText}</pre>
              </div>
            )}
            {expandedPdf === 'process' && (
              <div className="w-full my-2 border rounded bg-gray-50 p-4 animate-slide-down max-h-[60vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-lg">Process Terms</span>
                  <button onClick={() => setExpandedPdf(null)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                </div>
                <pre className="whitespace-pre-wrap text-base text-gray-900 font-sans text-left leading-relaxed tracking-normal" style={{fontFamily: 'Segoe UI, Arial, sans-serif', background: 'none', padding: 0, margin: 0}}>{ProcessTermsText}</pre>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !agreed}
              className={`w-full py-2 rounded-lg transition font-medium shadow ${
                loading || !agreed
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;
