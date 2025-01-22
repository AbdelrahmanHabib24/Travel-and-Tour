// SubmitButton.tsx  
import React from 'react';  

interface SubmitButtonProps {  
  loading: boolean;  
  disabled: boolean;  
}  

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, disabled }) => {  
  return (  
    <button  
      type="submit"  
      className={`w-full py-2 px-4 font-semibold text-white rounded-lg   
        ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}   
        transition duration-300 ease-in-out`}  
      disabled={disabled} // يؤدي لتعطيل الزر  
    >  
      {loading ? 'Loading...' : 'Log in'}  
    </button>  
  );  
};  

export default SubmitButton;