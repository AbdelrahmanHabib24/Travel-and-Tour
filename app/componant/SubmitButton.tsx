// components/SubmitButton.tsx  
import React from "react";  

interface SubmitButtonProps {  
  isFormValid: boolean;  
  loading: boolean;  
}  

const SubmitButton: React.FC<SubmitButtonProps> = ({ isFormValid, loading }) => {  
  return (  
    <button  
      type="submit"  
      className={`w-full py-2 rounded-md transition duration-200 ${  
        isFormValid  
          ? "bg-blue-500 text-white hover:bg-blue-600"  
          : "opacity-50 cursor-not-allowed bg-gray-300"  
      }`}  
      disabled={!isFormValid || loading}  
    >  
      {loading ? "Logging In..." : "Login"}  
    </button>  
  );  
};  

export default SubmitButton;