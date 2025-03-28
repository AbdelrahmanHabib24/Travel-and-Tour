"use client";   

import React from "react";  
import "slick-carousel/slick/slick.css";  
import "slick-carousel/slick/slick-theme.css";  
import { FEATURE } from "../ulits/type"; 
import FeatureItem from "./FeatureItem";  
import Slider from "react-slick";  
import { motion } from "framer-motion"; // Import Framer Motion

const Feature = () => {  
    const settings = {  
        dots: true,  
        autoplay: true,  
        infinite: true,  
        speed: 500,  
        slidesToShow: 3,  
        slidesToScroll: 1,  
        responsive: [  
            {  
                breakpoint: 1400,  
                settings: {  
                    slidesToShow: 4,  
                },  
            },  
            {  
                breakpoint: 1280, 
                settings: {  
                    slidesToShow: 3,  
                },  
            },  
            {  
                breakpoint: 768,  
                settings: {  
                    slidesToShow: 2,  
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
        <section id="feature" className="max_padd_container flex items-center justify-center xl:py-20 py-20">
            <div className="w-[110%] lg:w-[103%] md:w-[104%]">
                <div className="mx-4">
                    {/* Animated Title and Paragraph using Framer Motion */}
                    <motion.h4 
                        className="bold-16 text-secondary"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ 
                            duration: 1.5, 
                            ease: [0.25, 0.8, 0.25, 1] // Smooth ease-in-out effect
                        }} 
                    >
                        WHAT WE SERVE
                    </motion.h4>
                    <motion.h3 
                        className="bold-28 sm:text-xl md:text-2xl max-w-lg"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 1.5, 
                            ease: [0.25, 0.8, 0.25, 1], // Smooth ease-in-out effect
                            delay: 0.2 
                        }} 
                    >
                        We Provide Top Destinations
                    </motion.h3>
                    <motion.p 
                        className="max-w-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 1.5, 
                            ease: [0.25, 0.8, 0.25, 1], // Smooth ease-in-out effect
                            delay: 0.4 
                        }} 
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
                        eum tempora illum laboriosam corporis possimus ipsum, est
                        reprehenderit, voluptatum itaque repellendus voluptas error quasi
                        deserunt modi, obcaecati aliquam. Ullam, eligendi.
                    </motion.p>
                </div>
                
                <div className="pt-4">
                    <Slider {...settings}>
                        {/* Adding motion to each feature item to animate */}
                        {FEATURE.map((feature) => (
                            <motion.div 
                                key={feature.URL}
                                style={{ margin: "0 40px" }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                    duration: 1.5, 
                                    ease: [0.25, 0.8, 0.25, 1], // Smooth ease-in-out effect
                                    delay: 0.5 
                                }} 
                            >
                                <FeatureItem URL={feature.URL} title={feature.title} />
                            </motion.div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );  
};  

export default Feature;
