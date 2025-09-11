// components/InputField.tsx  
import React from "react";  

interface InputFieldProps {  
  id: string;  
  name: string;  
  label: string;  
  type: string;  
  value: string;  
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;  
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;  
  error?: string;  
}  

const InputField: React.FC<InputFieldProps> = ({  
  id,  
  name,  
  label,  
  type,  
  value,  
  onChange,  
  onBlur,  
  error,  
}) => {  
  return (  
    <div className="mb-4">  
      <label htmlFor={id} className="block mb-1 font-medium">  
        {label}:  
      </label>  
      <input  
        type={type}  
        id={id}  
        name={name}  
        value={value}  
        onChange={onChange}  
        onBlur={onBlur}  
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"  
        required  
      />  
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}  
    </div>  
  );  
};  

export default InputField;