/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";  

import { useRouter } from 'next/navigation';  
import React, { useState, useEffect } from 'react';  
import { useForm, SubmitHandler } from 'react-hook-form';  
import { FaCcVisa, FaCcMastercard, FaCcDiscover } from 'react-icons/fa';  
import { IoIosCloseCircleOutline } from 'react-icons/io';  
import { motion } from 'framer-motion';  

interface PaymentFormData {  
  cardNumber: string;  
  expiryDate: string;  
  cvc: string;  
}  

const PaymentPage: React.FC = () => {  
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [loading, setLoading] = useState(false);   
 
  const router = useRouter();   

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PaymentFormData>();  

  const onSubmit: SubmitHandler<PaymentFormData> = (data) => {  
    console.log('Processing payment with data:', data);  
    reset();  
    setIsModalOpen(false);  
  };  

  useEffect(() => {  
    setIsModalOpen(true);  
  }, []);  

  const closeModal = () => {  
    setIsModalOpen(false);  
    setTimeout(() => router.push("/"), 300);   
  };  

  // Motion variants for animation  
  const modalVariants = {  
    hidden: { opacity: 0, x: "-20%" },  
    visible: { opacity: 1, x: "0%" },  
    exit: { opacity: 0, x: "-20%" },  
  };  

  return (  
    <div className=" fix-height  max_padd_container   max-w-screen  px-4 py-8 relative">  
    <div className='max-w-screen-sm '>
      {isModalOpen && (  
        <div className="fixed inset-0 flex  justify-center items-center bg-gray-600 bg-opacity-50 z-50">  
          <motion.div  
            className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96"  
            initial="hidden"  
            animate="visible"  
            exit="exit"  
            variants={modalVariants}  
            transition={{ duration: 0.5}}  
          >  
            <div className="relative text-end">  
              <button  
                onClick={closeModal}  
                aria-label="Close modal"  
                className="text-gray-500 absolute bottom-0 hover:text-red-500 focus:outline-none"  
              >  
                <IoIosCloseCircleOutline className="text-2xl" />  
              </button>  
            </div>  

            <h2 className="text-xl font-bold mb-6 text-center">Enter Payment Details</h2>  

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">  
              {/* Card Number */}  
              <div className="mb-4">  
                <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-bold mb-2">  
                  Card Number  
                </label>  
                <div className="flex items-center  mb-2">  
                  <FaCcVisa className="text-blue-500  text-3xl" />  
                  <FaCcMastercard className="text-red-500 text-3xl" />  
                  <FaCcDiscover className="text-orange-500 text-3xl" />  
                </div>  
                <input  
                  type="text"  
                  id="cardNumber"  
                  {...register("cardNumber", {  
                    required: "Card number is required",  
                    pattern: { value: /^\d{4} \d{4} \d{4} \d{4}$/, message: "Invalid card number format" }  
                  })}  
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.cardNumber ? 'border-red-500' : ''}`}  
                  placeholder="1234 5678 9012 3456"  
                />  
                {errors.cardNumber && <p className="text-red-500 text-xs italic">{errors.cardNumber.message}</p>}  
              </div>  

              {/* Expiry Date */}  
              <div className="mb-4">  
                <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-2">  
                  Expiry Date (MM/YY)  
                </label>  
                <input  
                  type="text"  
                  id="expiryDate"  
                  {...register("expiryDate", {  
                    required: "Expiry date is required",  
                    pattern: { value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/, message: "Invalid expiry date format" }  
                  })}  
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.expiryDate ? 'border-red-500' : ''}`}  
                  placeholder="MM/YY"  
                />  
                {errors.expiryDate && <p className="text-red-500 text-xs italic">{errors.expiryDate.message}</p>}  
              </div>  

              {/* CVC */}  
              <div className="mb-4">  
                <label htmlFor="cvc" className="block text-gray-700 text-sm font-bold mb-2">  
                  CVC  
                </label>  
                <input  
                  type="text"  
                  id="cvc"  
                  {...register("cvc", {  
                    required: "CVC is required",  
                    minLength: { value: 3, message: "CVC must be at least 3 characters" },  
                    maxLength: { value: 4, message: "CVC must be at most 4 characters" }  
                  })}  
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.cvc ? 'border-red-500' : ''}`}  
                  placeholder="CVC"  
                />  
                {errors.cvc && <p className="text-red-500 text-xs italic">{errors.cvc.message}</p>}  
              </div>  

              {/* Submit Button */}  
              <div className="flex justify-center items-center">  
              <button  
                  type="submit"  
                  className={`bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}  
                  disabled={loading} // Disable button if loading  
                >  
                  {loading ? (<span>Loading...</span>) : (<span>Pay Now</span>)} {/* Loading indicator */}  
                </button>  
              </div>  
            </form>  
          </motion.div>  
        </div>  
      )}  
      </div>
    </div>  
  );  
};  

export default PaymentPage;