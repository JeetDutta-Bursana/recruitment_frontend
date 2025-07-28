
// // === EditJob.jsx ===
// import { useForm } from 'react-hook-form';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from '../api/axiosInstance';
// import { useEffect } from 'react';

// const EditJob = () => {
//   const { jobId } = useParams();
//   const navigate = useNavigate();
//   const { register, handleSubmit, setValue } = useForm();

//   useEffect(() => {
//     axios.get(`/api/jobs/${jobId}`)
//       .then((res) => {
//         const job = res.data;
//         Object.keys(job).forEach(key => setValue(key, job[key]));
//       })
//       .catch(() => alert('❌ Failed to load job'));
//   }, [jobId]);

//   const onSubmit = async (data) => {
//     try {
//       await axios.put(`/api/jobs/edit/${jobId}`, data);
//       alert('✅ Job updated!');
//       navigate('/employee/all-jobs');
//     } catch (err) {
//       console.error(err);
//       alert('❌ Failed to update job');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4">✏️ Edit Job</h2>
//       <input className="w-full border p-2 mb-3" {...register('title')} placeholder="Title" />
//       <input className="w-full border p-2 mb-3" {...register('company')} placeholder="Company" />
//       <input className="w-full border p-2 mb-3" {...register('location')} placeholder="Location" />
//       <input className="w-full border p-2 mb-3" {...register('last-date')} placeholder="Last Date" />
//       <textarea className="w-full border p-2 mb-3" {...register('description')} placeholder="Description" />
//       {/* Add other fields if needed */}
//       <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Job</button>
//     </form>
//   );
// };

// export default EditJob;