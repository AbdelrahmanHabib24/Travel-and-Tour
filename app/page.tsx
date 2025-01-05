import Feature from "./componant/Feature";
import Hero from "./componant/Hero";
import Listing from "./componant/Listing";
import Testimonials from "./componant/Testimonials";
import ProtectedHome from "./componant/Home";

export default function Home() {
  return (
    <div className=" overflow-hidden"> 
    <ProtectedHome/>
    <Hero/>
    <Feature/>
    <Listing/>
    <Testimonials  />
    </div>
  );
}
