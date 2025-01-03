import Feature from "./componant/Feature";
import Hero from "./componant/Hero";
import Listing from "./componant/Listing";
import Testimonials from "./componant/Testimonials";

export default function Home() {
  return (
    <div className=" overflow-hidden"> 
    <Hero/>
    <Feature/>
    <Listing/>
    <Testimonials  />
    </div>
  );
}
