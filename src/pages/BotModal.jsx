// src/pages/BotModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobBotService from "../api/JobBotService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BotModal = ({ job, user, onClose, onFinish }) => {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [qualified, setQualified] = useState(null);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState("questions");
  const [enhancedCv, setEnhancedCv] = useState("");
  const [enhancing, setEnhancing] = useState(false);
  const [resumeSent, setResumeSent] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const fixedQuestions = [
    { id: "location", text: "Which place are you from?" },
    { id: "relocate", text: "Are you willing to relocate? (yes/no)" },
    {
      id: "salary",
      text: `Are you okay with a salary between ${job.minSalary} and ${job.maxSalary}? (yes/no)`,
    },
    { id: "qualification", text: "What is your highest educational qualification?" },
    { id: "experience", text: "How many years of relevant work experience do you have?" },
  ];

  useEffect(() => {
    if (started) {
      setLoadingQuestions(true);
      JobBotService.generateQuestions(job.title)
        .then((res) => setDynamicQuestions(Array.isArray(res.data.questions) ? res.data.questions : []))
        .catch(() => setDynamicQuestions([]))
        .finally(() => setLoadingQuestions(false));
    }
  }, [started, job.title]);

  const allQuestions = [
    ...fixedQuestions.map((q) => ({ ...q, type: "text" })),
    ...dynamicQuestions.map((q, i) => ({
      id: `dynamic_${i}`,
      text: q.question,
      options: q.options,
      type: "mcq",
    })),
  ];

  const currentQuestion = allQuestions[currentIndex];

  const handleTextAnswer = (id, answer) => {
    setAnswers((prev) => ({ ...prev, [id]: answer }));
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleNextMcq = () => {
    if (selectedOption !== null) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOption }));
      setSelectedOption(null);
      if (currentIndex < allQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const allQs = [...fixedQuestions.map(q => q.text), ...dynamicQuestions.map(q => q.question)];
    const allAs = [
      ...fixedQuestions.map((q) => answers[q.id] || ""),
      ...dynamicQuestions.map((q, i) => {
        const selected = answers[`dynamic_${i}`];
        return typeof selected === "number" ? dynamicQuestions[i].options[selected] : "";
      }),
    ];

    try {
      const res = await JobBotService.evaluateAnswers(allQs, allAs);
      const data = res.data;
      setScore(data.score);
      setQualified(data.qualified);
      setStep(data.qualified ? "enhancePrompt" : "results");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayAndEnhance = () => setShowPayment(true);

  const handleProcessPayment = () => {
    setPaymentProcessing(true);
    toast.info("Processing payment...");
    setTimeout(async () => {
      toast.success("✅ Payment successful!");
      setShowPayment(false);
      setPaymentProcessing(false);
      await enhanceResume();
    }, 1500);
  };

  const enhanceResume = async () => {
    setEnhancing(true);
    try {
      const res = await JobBotService.getUserResume(user.userId);
      const resumeText = res.data.resume;

      const enhanceRes = await JobBotService.enhanceResume({
        resume: resumeText,
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description || "",
      });

      setEnhancedCv(enhanceRes.data.enhancedCv);
    } catch (err) {
      console.error(err);
    } finally {
      setEnhancing(false);
    }
  };

  const handleSendResume = async () => {
    try {
      await JobBotService.applyToJob({
        userId: user.userId,
        jobId: job.jobId,
        answers,
        score,
        qualified: true,
      });
      setResumeSent(true);
    } catch (err) {
      console.error("Failed to apply:", err);
    }
  };

  const handleCloseAndApply = async () => {
    if (!resumeSent) await handleSendResume();
    if (onFinish) onFinish(true);
    navigate("/home");
  };

  const handleCloseOnly = () => {
    if (onFinish) onFinish(false);
    navigate("/home", { state: { scrollToJobId: job.jobId } });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <ToastContainer />
      <div className="flex-1 bg-black bg-opacity-50" onClick={handleCloseOnly} />
      <div className="relative w-full sm:max-w-md bg-white h-full shadow-lg overflow-y-auto">
        <button
          onClick={handleCloseOnly}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        <div className="p-6 text-center">
          {!started && !enhancedCv && (
            <>
              <h2 className="text-2xl font-bold mb-4">👋 Hello!</h2>
              <button
                onClick={() => setStarted(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
              >
                Start Questions
              </button>
            </>
          )}

          {started && loadingQuestions && <p>Loading questions...</p>}

          {started && !loadingQuestions && step === "questions" && currentQuestion && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Question {currentIndex + 1} of {allQuestions.length}
              </h2>
              <p className="mb-4">{currentQuestion.text}</p>
              {currentQuestion.type === "text" ? (
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Your answer..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      handleTextAnswer(currentQuestion.id, e.target.value.trim());
                      e.target.value = "";
                    }
                  }}
                />
              ) : (
                <>
                  {currentQuestion.options.map((opt, idx) => (
                    <label key={idx} className="block mb-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={selectedOption === idx}
                        onChange={() => setSelectedOption(idx)}
                      />{" "}
                      {opt}
                    </label>
                  ))}
                  <button
                    onClick={currentIndex === allQuestions.length - 1 ? handleSubmit : handleNextMcq}
                    disabled={selectedOption === null || submitting}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {currentIndex === allQuestions.length - 1
                      ? submitting
                        ? "Submitting..."
                        : "Submit"
                      : "Next"}
                  </button>
                </>
              )}
            </div>
          )}

          {step === "results" && !qualified && (
            <>
              <h2 className="text-red-600 text-xl font-bold mb-2">Not Qualified</h2>
              <p>Your score: {score}</p>
              <button onClick={handleCloseOnly} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">
                Close
              </button>
            </>
          )}

          {step === "enhancePrompt" && !showPayment && (
            <>
              <h2 className="text-green-700 text-xl font-bold mb-2">✅ Qualified!</h2>
              <p>Would you like to enhance your resume?</p>
              <div className="mt-4 flex gap-2 justify-center">
                <button onClick={handlePayAndEnhance} className="bg-indigo-600 text-white px-4 py-2 rounded">
                  Yes, Enhance
                </button>
                <button
                onClick={async () => {
                  await handleSendResume();
                  setResumeSent(true);
                  if (onFinish) onFinish(true);
                  navigate("/home");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                No, Skip
              </button>

              </div>
            </>
          )}

          {showPayment && (
            <>
              <h2 className="text-xl font-bold mb-4">💳 Choose Payment Method</h2>
              {!paymentMethod ? (
                <>
                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className="mb-3 bg-blue-600 text-white px-6 py-2 rounded w-full"
                  >
                    Pay via UPI
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className="bg-indigo-600 text-white px-6 py-2 rounded w-full"
                  >
                    Pay via Card
                  </button>
                </>
              ) : (
                <>
                  {paymentMethod === "upi" ? (
                    <input
                      type="text"
                      placeholder="Enter UPI ID"
                      className="border p-2 rounded w-full mb-3"
                      onChange={(e) => setPaymentDetails({ upiId: e.target.value })}
                    />
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="border p-2 rounded w-full mb-3"
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Expiry MM/YY"
                        className="border p-2 rounded w-full mb-3"
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="border p-2 rounded w-full mb-3"
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      />
                    </>
                  )}
                  <button
                    onClick={handleProcessPayment}
                    disabled={paymentProcessing}
                    className="bg-green-600 text-white px-6 py-2 rounded w-full"
                  >
                    {paymentProcessing ? "Processing..." : "Pay & Enhance"}
                  </button>
                </>
              )}
            </>
          )}

          {enhancing && <p className="text-blue-600">Enhancing your resume...</p>}

          {enhancedCv && (
            <>
              <h2 className="text-green-700 text-xl font-bold mb-2">🎉 Resume Enhanced!</h2>
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(enhancedCv)}`}
                download="enhanced_resume.txt"
                className="block mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Download Enhanced Resume
              </a>
              {!resumeSent ? (
                <button
                  onClick={handleSendResume}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                >
                  Send Resume to Client
                </button>
              ) : (
                <p className="mt-4 text-sm text-gray-700">
                  ✅ Resume sent to client. Please check back later.
                </p>
              )}
              <button
                onClick={handleCloseAndApply}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotModal;
