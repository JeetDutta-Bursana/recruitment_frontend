// import { useState, useEffect } from 'react';
// import axios from '../api/axiosInstance';

// const PreScreeningModal = ({ job, seekerId, onClose, onPass, onFail }) => {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [input, setInput] = useState('');
//   const [index, setIndex] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .post('/api/prescreening/generate-questions', job)
//       .then((res) => {
//         setQuestions(res.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         alert('Error loading questions');
//         onClose();
//       });
//   }, [job]);

//   const handleSubmit = async () => {
//     if (!input.trim()) return;

//     const newAnswers = [...answers, input];
//     setAnswers(newAnswers);
//     setInput('');

//     if (index + 1 < questions.length) {
//       setIndex(index + 1);
//     } else {
//       const res = await axios.post('/api/prescreening/evaluate', {
//         questions,
//         answers: newAnswers,
//         seekerId,
//         jobId: job.jobId
//       });
//       res.data.passed ? onPass() : onFail();
//       onClose();
//     }
//   };

//   if (loading) return <div>Loading questions...</div>;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-box">
//         <h3>Question {index + 1} of {questions.length}</h3>
//         <p>{questions[index]}</p>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Your answer..."
//         />
//         <div className="modal-actions">
//           <button onClick={onClose}>Cancel</button>
//           <button onClick={handleSubmit}>Submit</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PreScreeningModal;
