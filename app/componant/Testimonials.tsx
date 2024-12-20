'use client'; // Client-side rendering directive  

import React from "react";  
import { TESTIMONIALS } from "../ulits/type";  
import Image from "next/image";  
import dynamic from "next/dynamic";  

// Dynamically import the Slider component with SSR disabled  
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
    <div className=" py-10">  
      <div className="w-[90%] mx-auto"> {/* Center content on larger screens */}  
        <h4 className="bold-16 text-center text-secondary">HAPPY CUSTOMER</h4>  
        <h3 className="bold-28 regular-22 text-center mb-5">Testimonials</h3>  

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
    </div>  
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
    <div className=" mb-4 justify-center items-center flex flex-col  "> {/* Centered text styling */}  
      <Image  
        className="rounded-full  "  
        src={URL}  
        alt={title}  
        width={100}  
        height={100}  
        layout="intrinsic" // Adjust layout for better responsiveness  
        priority // Load image with priority for better performance (consider based on image importance)  
      />  
      <h4 className="bold-22 text-secondary mt-2">{title}</h4> {/* Added margin for spacing */}  
      <h5 className="text-gray-500">{Profession}</h5> {/* Styled profession with a different color */}  
      <p className=" text-tertiary  text-center mt-2">{`"${Desc}"`}</p> {/* Center and limit text width */}  
    </div>  
  );  
};  

export default Testimonials;