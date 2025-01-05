import React from 'react';

interface FormProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  isFormValid: boolean;
}

const Form: React.FC<FormProps> = ({
  formData,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  loading,
  isFormValid,
}) => {
  const allFieldsFilled =
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    isFormValid; // التحقق من أن الحقول ممتلئة وصحيحة

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Username */}
      <div className="mb-4">
        <label htmlFor="username" className="block mb-1 font-medium">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">{errors.username}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1 font-medium">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block mb-1 font-medium">
          Confirm Password:
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 rounded-md transition duration-200 ${
          allFieldsFilled && !loading
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!allFieldsFilled || loading}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default Form;
