"use client";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import SwiperCore from "swiper";
import { testimonialsData } from "@/app/data";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";

SwiperCore.use([Navigation, Pagination]);

const Testimonials = () => {
  return (
    <div className="min-h-screen pb-12 md:pb-24 lg:pb-36 px-4 md:px-16 lg:px-20 font-poppins">
      <h1 className="font-paralucent text-4xl  text-center text-[#182822] leading-normal">
        Testimonials
      </h1>
      <h6 className="text-center font-semibold text-[#f29620]">
        What Clients Say
      </h6>

      {/* Testimonials */}
      <div className="max-w-3xl mt-20 mx-auto text-center testimonials__caurosel">
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          slidesPerView={1}
          spaceBetween={1}
          slidesPerGroup={1}
          autoplay={true}
          pagination={true}
          slideActiveClass="activeSlide"
          className="swiper-container"
        >
          {testimonialsData.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="relative mb-12 w-full">
                <FaQuoteLeft className="text-[55px] text-[#32A632] absolute left-0  " />
                <FaQuoteRight className="text-[55px] text-[#32A632] absolute right-0  " />

                <img
                  className="w-36 h-36 mx-auto text-center rounded-full"
                  src={testimonial.image}
                  alt={testimonial.name}
                />

                {/* Testimonial Text */}
                <blockquote className="px-4 pt-8">
                  <p className="text-[#63716c] leading-loose text-lg italic">
                    {testimonial.text}
                  </p>
                </blockquote>

                {/* Client Details */}
                <div className="mt-8 ">
                  <p className="text-lg font-medium">{testimonial.name}</p>
                  <p className="text-[#63716c] text-sm">{testimonial.title}</p>
                </div>
              </div>
              <div className="sm:h-7"></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;
