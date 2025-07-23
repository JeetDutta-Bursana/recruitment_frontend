const InputField = ({ label, value, onChange, type = "text", placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
};

export default InputField;