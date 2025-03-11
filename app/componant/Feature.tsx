"use client";   

import React from "react";  
import "slick-carousel/slick/slick.css";  
import "slick-carousel/slick/slick-theme.css";  
import { FEATURE } from "../ulits/type"; 
import FeatureItem from "./FeatureItem";  
import Slider from "react-slick";  

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
        <section className="max_padd_container flex items-center justify-center  xl:py-20 py-20">
            <div className="w-[110%]  lg:w-[103%] md:w-[104%]">
                <div className="mx-4">
                    <h4 className="bold-16 text-secondary">WHAT WE SERVE</h4>
                    <h3 className="bold-28 sm:text-xl md:text-2xl max-w-lg">We Provide Top Destinations</h3>
                    <p className="max-w-lg">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
                        eum tempora illum laboriosam corporis possimus ipsum, est
                        reprehenderit, voluptatum itaque repellendus voluptas error quasi
                        deserunt modi, obcaecati aliquam. Ullam, eligendi.
                    </p>
                </div>
                <div className=" pt-4">
                <Slider
                    
                    {...settings}
                >
                    {FEATURE.map((feature) => (
                        <div key={feature.URL} style={{ margin: "0 40px" }}>
                            <FeatureItem

                                URL={feature.URL}
                                title={feature.title} />
                        </div>
                    ))}
                </Slider>
            </div>

            </div>
        </section>
    );  
};  

export default Feature;