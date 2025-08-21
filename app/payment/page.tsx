/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FaLock, FaCreditCard } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvc: string;
}

const PaymentPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Card preview values
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focused, setFocused] = useState<any>("");

  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PaymentFormData>();

  const onSubmit: SubmitHandler<PaymentFormData> = (data) => {
    console.log("Processing payment with data:", data);
    setLoading(true);

    // Simulate payment
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      reset();
      setCardNumber("");
      setCardName("");
      setExpiry("");
      setCvc("");
      setTimeout(() => {
        setIsModalOpen(false);
        router.push("/");
      }, 2000);
    }, 1500);
  };

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => router.push("/"), 300);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: "-10%" },
    visible: { opacity: 1, y: "0%" },
    exit: { opacity: 0, y: "-10%" },
  };

  return (
    <div className="fix-height max_padd_container max-w-screen px-4 py-8 relative">
      <div className="max-w-screen-sm">
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-lg w-full sm:w-96 relative"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                transition={{ duration: 0.5 }}
              >
                {/* Close button */}
                <button
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <IoIosCloseCircleOutline className="text-3xl" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  Secure Checkout
                </h2>

                {/* Card preview */}
                <div className="mb-6">
                  <Cards
                    number={cardNumber}
                    expiry={expiry}
                    cvc={cvc}
                    name={cardName || "Your Name"}
                    focused={focused}
                  />
                </div>

                {/* Success message */}
                {success ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <p className="text-green-600 font-bold text-lg">
                      ✅ Payment Successful!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Card Number */}
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Card Number
                      </label>
                      <div className="relative">
                        <FaCreditCard className="absolute left-3 top-3 text-gray-400" />
                        <Controller
                          name="cardNumber"
                          control={control}
                          rules={{
                            required: "Card number is required",
                            pattern: {
                              value: /^\d{16}$/,
                              message: "Enter a valid 16-digit card number",
                            },
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                field.onChange(value);
                                setCardNumber(value);
                              }}
                              onFocus={(e) => setFocused(e.target.name)}
                              name="number"
                              value={cardNumber}
                              maxLength={16}
                              className={`shadow appearance-none border rounded w-full py-2 pl-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                errors.cardNumber ? "border-red-500" : ""
                              }`}
                              placeholder="1234 5678 9012 3456"
                            />
                          )}
                        />
                      </div>
                      {errors.cardNumber && (
                        <p className="text-red-500 text-xs italic mt-1">
                          {errors.cardNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Card Name */}
                    <div>
                      <label
                        htmlFor="cardName"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Name on Card
                      </label>
                      <Controller
                        name="cardName"
                        control={control}
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setCardName(e.target.value);
                            }}
                            onFocus={(e) => setFocused(e.target.name)}
                            name="name"
                            value={cardName}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                              errors.cardName ? "border-red-500" : ""
                            }`}
                            placeholder="John Doe"
                          />
                        )}
                      />
                      {errors.cardName && (
                        <p className="text-red-500 text-xs italic mt-1">
                          {errors.cardName.message}
                        </p>
                      )}
                    </div>

                    {/* Expiry + CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Expiry (MMYY)
                        </label>
                        <Controller
                          name="expiryDate"
                          control={control}
                          rules={{
                            required: "Expiry date is required",
                            pattern: {
                              value: /^(0[1-9]|1[0-2])([0-9]{2})$/,
                              message: "Invalid format (MMYY)",
                            },
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                field.onChange(value);
                                setExpiry(value);
                              }}
                              onFocus={(e) => setFocused(e.target.name)}
                              name="expiry"
                              value={expiry}
                              maxLength={4}
                              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                errors.expiryDate ? "border-red-500" : ""
                              }`}
                              placeholder="MMYY"
                            />
                          )}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-xs italic mt-1">
                            {errors.expiryDate.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="cvc"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          CVC
                        </label>
                        <Controller
                          name="cvc"
                          control={control}
                          rules={{
                            required: "CVC is required",
                            minLength: {
                              value: 3,
                              message: "Must be at least 3 digits",
                            },
                            maxLength: {
                              value: 4,
                              message: "Must be at most 4 digits",
                            },
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="password"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                field.onChange(value);
                                setCvc(value);
                              }}
                              onFocus={(e) => setFocused(e.target.name)}
                              name="cvc"
                              value={cvc}
                              maxLength={4}
                              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                errors.cvc ? "border-red-500" : ""
                              }`}
                              placeholder="CVC"
                            />
                          )}
                        />
                        {errors.cvc && (
                          <p className="text-red-500 text-xs italic mt-1">
                            {errors.cvc.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center items-center">
                      <button
                        type="submit"
                        className={`bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 focus:outline-none focus:shadow-outline ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={loading}
                      >
                        <FaLock />{" "}
                        {loading ? <span>Processing...</span> : "Pay Securely"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentPage;