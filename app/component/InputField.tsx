// // components/InputField.tsx  
// import React from "react";  

// interface InputFieldProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   error?: string;
// }

// const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
//   ({ id, label, error, ...props }, ref) => {
//     return (
//       <div className="mb-4">
//         <label htmlFor={id} className="block mb-1 font-medium">
//           {label}:
//         </label>
//         <input
//           id={id}
//           ref={ref}
//           className={`w-full border rounded-md p-2 focus:outline-none focus:ring ${
//             error
//               ? "border-red-500 focus:ring-red-300"
//               : "border-gray-300 focus:ring-blue-300"
//           }`}
//           {...props} 
//         />
//         {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
//       </div>
//     );
//   }
// );

// InputField.displayName = "InputField";
// export default InputField;