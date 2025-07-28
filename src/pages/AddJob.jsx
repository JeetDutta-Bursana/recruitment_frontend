import { useForm } from "react-hook-form";
import axios from "../api/axiosInstance";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import JobServices from "../api/JobServices";
import EmployeeAuthServices from "../api/EmployeeAuthServices";
import { useLocation } from "react-router-dom";

const predefinedLocations = [
  "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune",
  "Chennai", "Kolkata", "Noida", "Gurgaon", "Ahmedabad", "Other"
];

const qualificationOptions = [
  "High School", "Diploma", "Bachelor's Degree",
  "Master's Degree", "Doctorate / PhD", "Other"
];

const AddJob = ({ onJobAdded }) => {
  const location = useLocation();
  const initialData = location.state || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const [user, setUser] = useState(null);
  const [previousJobData, setPreviousJobData] = useState(null);

  const watchLocation = watch("location", "");
  const watchQualification = watch("highestQualification", "");

  useEffect(() => {
    EmployeeAuthServices.fetchCurrentEmployee()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    if (!user) {
      alert("⚠️ Please login as an employer to post a job.");
      return;
    }

    const minSalary =
      (parseInt(data.minSalaryLakh || 0) * 100000) +
      (parseInt(data.minSalaryThousand || 0) * 1000);
    const maxSalary =
      (parseInt(data.maxSalaryLakh || 0) * 100000) +
      (parseInt(data.maxSalaryThousand || 0) * 1000);

    const openingDate = new Date(data.openingDate);
    const closingDate = new Date(data.closingDate);

    if (maxSalary && minSalary >= maxSalary) {
      setError("maxSalaryLakh", { message: "Max salary must be greater than min salary." });
      return;
    }

    if (closingDate <= openingDate) {
      setError("closingDate", { message: "Closing date must be after opening date." });
      return;
    }

    const jobData = {
      jobId: uuidv4(),
      title: data.title,
      company: data.company?.trim() || user.company || "N/A",
      location: data.location === "Other" ? data.otherLocation : data.location,
      highestQualification: data.highestQualification === "Other" ? data.otherQualification : data.highestQualification,
      minSalary: `${(minSalary / 100000).toFixed(2)}L`,
      maxSalary: `${(maxSalary / 100000).toFixed(2)}L`,
      experience: data.experience,
      jobType: data.jobType,
      description: data.description,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
      perks: data.perks,
      department: data.department,
      employmentType: data.employmentType,
      openings: data.openings,
      openingDate: data.openingDate,
      lastDate: data.closingDate,
      mode: data.mode,
      contactEmail: data.contactEmail,
    };

    if (previousJobData && JSON.stringify(previousJobData) === JSON.stringify(jobData)) {
      const confirmPost = window.confirm(
        "⚠️ You have already posted this exact job. Do you still want to post it again?"
      );
      if (!confirmPost) return;
    }

    try {
      await JobServices.addJob(jobData);
      alert("✅ Job posted successfully!");
      setPreviousJobData(jobData);
      reset();
      if (onJobAdded) onJobAdded();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to post job.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 text-sm text-gray-700 max-w-3xl mx-auto bg-white p-6 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-4">📝 Add New Job</h2>

      {/* ...form fields remain unchanged... */}
        {/* Title */}
      <input
        type="text"
        placeholder="Job Title"
        {...register("title", { required: "Job title is required" })}
        className="w-full border px-4 py-2 rounded"
      />
      {errors.title && <p className="text-red-600 text-xs">{errors.title.message}</p>}

      {/* Company */}
      <input
        type="text"
        placeholder="Company Name"
        {...register("company")}
        className="w-full border px-4 py-2 rounded"
      />

      {/* Job Type & Department */}
      <div className="flex gap-4">
        <select {...register("jobType")} className="w-1/2 border px-4 py-2 rounded">
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Freelance">Freelance</option>
        </select>
        <input
          type="text"
          placeholder="Department"
          {...register("department")}
          className="w-1/2 border px-4 py-2 rounded"
        />
      </div>

      {/* Employment Type & Experience */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Employment Type"
          {...register("employmentType")}
          className="w-1/2 border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Experience"
          {...register("experience")}
          className="w-1/2 border px-4 py-2 rounded"
        />
      </div>

      {/* Mode */}
      <select
        {...register("mode", { required: "Mode is required" })}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="">Select Mode</option>
        <option value="Onsite">Onsite</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
      </select>
      {errors.mode && <p className="text-red-600 text-xs">{errors.mode.message}</p>}

      {/* Location */}
      <select
        {...register("location", { required: "Location is required" })}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="">Select Location</option>
        {predefinedLocations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      {watchLocation === "Other" && (
        <input
          type="text"
          placeholder="Enter custom location"
          {...register("otherLocation", { required: "Please enter location" })}
          className="w-full border px-4 py-2 rounded mt-2"
        />
      )}
      {errors.location && <p className="text-red-600 text-xs">{errors.location.message}</p>}
      {errors.otherLocation && <p className="text-red-600 text-xs">{errors.otherLocation.message}</p>}

      {/* Qualification */}
      <select
        {...register("highestQualification", { required: "Qualification is required" })}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="">Select Highest Qualification</option>
        {qualificationOptions.map((q) => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
      {watchQualification === "Other" && (
        <input
          type="text"
          placeholder="Enter custom qualification"
          {...register("otherQualification", { required: "Please enter qualification" })}
          className="w-full border px-4 py-2 rounded mt-2"
        />
      )}
      {errors.highestQualification && <p className="text-red-600 text-xs">{errors.highestQualification.message}</p>}
      {errors.otherQualification && <p className="text-red-600 text-xs">{errors.otherQualification.message}</p>}

      {/* Salary */}
      <div>
        <label className="block font-medium mb-1">Min Salary (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Lakhs"
            {...register("minSalaryLakh", { valueAsNumber: true })}
            className="w-1/2 border px-4 py-2 rounded"
          />
          <input
            type="number"
            min="0"
            placeholder="Thousands"
            {...register("minSalaryThousand", { valueAsNumber: true })}
            className="w-1/2 border px-4 py-2 rounded"
          />
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Max Salary (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Lakhs"
            {...register("maxSalaryLakh", { valueAsNumber: true })}
            className="w-1/2 border px-4 py-2 rounded"
          />
          <input
            type="number"
            min="0"
            placeholder="Thousands"
            {...register("maxSalaryThousand", { valueAsNumber: true })}
            className="w-1/2 border px-4 py-2 rounded"
          />
        </div>
        {errors.maxSalaryLakh && (
          <p className="text-red-600 text-xs">{errors.maxSalaryLakh.message}</p>
        )}
      </div>

      {/* Openings */}
      <input
        type="number"
        placeholder="Number of Openings"
        {...register("openings", { min: 1 })}
        className="w-full border px-4 py-2 rounded"
      />

      {/* Dates */}
      <div className="flex gap-4">
        <input
          type="date"
          placeholder="Opening Date"
          {...register("openingDate", { required: true })}
          className="w-1/2 border px-4 py-2 rounded"
        />
        <input
          type="date"
          placeholder="Closing Date"
          {...register("closingDate", { required: true })}
          className="w-1/2 border px-4 py-2 rounded"
        />
      </div>
      {errors.closingDate && (
        <p className="text-red-600 text-xs">{errors.closingDate.message}</p>
      )}

      {/* Contact Email */}
      <input
        type="email"
        placeholder="Hiring Manager Email"
        {...register("contactEmail", {
          
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email format",
          },
        })}
        className="w-full border px-4 py-2 rounded"
      />
      {errors.contactEmail && (
        <p className="text-red-600 text-xs">{errors.contactEmail.message}</p>
      )}

      {/* Description */}
      <textarea
        placeholder="Job Description"
        {...register("description")}
        rows="4"
        className="w-full border px-4 py-2 rounded"
      />

      {/* Responsibilities */}
      <textarea
        placeholder="Responsibilities"
        {...register("responsibilities")}
        rows="4"
        className="w-full border px-4 py-2 rounded"
      />

      {/* Requirements */}
      <textarea
        placeholder="Requirements"
        {...register("requirements")}
        rows="4"
        className="w-full border px-4 py-2 rounded"
      />

      {/* Perks */}
      <textarea
        placeholder="Perks and Benefits"
        {...register("perks")}
        rows="3"
        className="w-full border px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 w-full"
      >
        Submit Job
      </button>
    </form>
  );
};

export default AddJob;
