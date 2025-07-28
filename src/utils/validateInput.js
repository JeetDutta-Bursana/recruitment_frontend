export const validateInput = (value) => {
  if (!value || value.trim() === "") return "This field is required.";
  if (value.length < 3) return "Must be at least 3 characters.";
  return null;
};