'use client';   

import React from "react";  
import { TESTIMONIALS } from "../ulits/type";  
import Image from "next/image";  
import dynamic from "next/dynamic";  
import { motion } from "framer-motion";  

const Slider = dynamic(() => import("react-slick"), { ssr: false });  

const Testimonials = () => {  
    const settings = {  
        autoplay: true,  
        infinite: true,
        arrows: false,  
        speed: 500,  
        slidesToShow: 1,  
        slidesToScroll: 1,  
        responsive: [  
            {  
                breakpoint: 1400,  
                settings: {  
                    slidesToShow: 1,  
                },  
            },  
            {  
                breakpoint: 1280,  
                settings: {  
                    slidesToShow: 1,  
                },  
            },  
            {  
                breakpoint: 768,  
                settings: {  
                    slidesToShow: 1,  
                },  
            },  
            {  
                breakpoint: 640,  
                settings: {  
                    slidesToShow: 1,  
                },  
            },  
        ],  
    };  

  return (  
    <motion.section  
      className="py-10"  
      initial={{ opacity: 0 }}  
      whileInView={{ opacity: 1 }}  
      transition={{ duration: 1, ease: "easeOut" }}  
    >  
      <div className="w-[90%] mx-auto">   
        <motion.h4  
          className="bold-16 text-center text-secondary"  
          initial={{ opacity: 0, y: -20 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}  
        >
          HAPPY CUSTOMER
        </motion.h4>  
        <motion.h3  
          className="bold-28 regular-22 text-center mb-5"  
          initial={{ opacity: 0, y: -20 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}   
        >
          Testimonials
        </motion.h3>  

        <Slider {...settings}>  
          {TESTIMONIALS.map((item) => (  
            <TestimonialsItem  
              key={item.title}  
              title={item.title}  
              Profession={item.Profession}  
              URL={item.URL}  
              Desc={item.Desc}  
            />  
          ))}  
        </Slider>  
      </div>  
    </motion.section>  
  );  
};  

type TestimonialsProps = {  
  title: string;  
  Profession: string;  
  URL: string;  
  Desc: string;  
};  

export const TestimonialsItem = ({  
  title,  
  Profession,  
  URL,  
  Desc,  
}: TestimonialsProps) => {  
  return (  
    <motion.div  
      id="testimonials"  
      className="mb-4 justify-center items-center flex flex-col"  
      initial={{ opacity: 0, scale: 0.9 }}  
      whileInView={{ opacity: 1, scale: 1 }}   
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}   
    >  
      <Image  
        className="rounded-full"  
        src={URL}  
        alt={title}  
        width={100}  
        height={100}  
        layout="intrinsic" 
        priority  
      />  
      <h4 className="bold-22 text-secondary mt-2">{title}</h4>  
      <h5 className="text-gray-500">{Profession}</h5>  
      <p className="text-tertiary text-center mt-2">{`"${Desc}"`}</p>  
    </motion.div>  
  );  
};  

export default Testimonials;
