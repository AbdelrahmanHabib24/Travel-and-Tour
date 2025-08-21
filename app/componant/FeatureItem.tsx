import Link from "next/link";  
import Image from "next/image";

type FeatureItemProps = {  
  URL: string;  
  title: string;  
};  

const FeatureItem = ({ URL, title }: FeatureItemProps) => {  
  return (  
    <div className="mx-4  group"> 
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
          <h4 className="capitalize absolute top-6 left-4 bg-black/60 text-white text-sm sm:text-md lg:text-lg font-semibold rounded-lg px-4 py-2 transition-opacity duration-300 group-hover:bg-secondary shadow-lg">  
            {title}  
          </h4>  
        </div>  
      </Link>  
    </div>  
  );  
};  

export default FeatureItem;