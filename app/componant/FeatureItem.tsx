import Link from "next/link"; // Use the direct import for `next/link`.  
import Image from "next/image"; // Import the Image component.  

type FeatureItemProps = {  
  URL: string;  
  title: string;  
};  

const FeatureItem = ({ URL, title }: FeatureItemProps) => {  
  return (  
    <div className="mx-4  group"> {/* إضافة mb-8 هنا */}  
      <Link  
        href="/"  
        className="overflow-hidden relative"  
        aria-label={`Feature: ${title}`}  
      >  
        <div >  
          <Image  
            src={URL}  
            alt={title}  
            height={600}  
            width={510}  
            className="rounded-lg lg:rounded-xl shadow-lg  transition-transform duration-700 ease-in-out group-hover:scale-105"  
          />  
          <h4 className="capitalize absolute top-4 left-3 bg-black/60 text-white text-sm sm:text-md lg:text-lg font-semibold rounded-lg px-4 py-2 transition-opacity duration-300 group-hover:bg-secondary shadow-lg">  
            {title}  
          </h4>  
        </div>  
      </Link>  
    </div>  
  );  
};  

export default FeatureItem;