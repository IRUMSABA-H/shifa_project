"use client";
import Image from "next/image";
import Link from "next/link";
import { TbLogout } from "react-icons/tb";

interface HeaderProps {
  onAddClick?: () => void; // parent se function receive karega
}
export default function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="flex  justify-between p-5 fixed top-0 left-0 w-full bg-white shadow-md z-50">
      {/* Left: Logo */}
      <div className="flex items-left">
        <Image src="/image.png" width={100} height={100} alt="Logo" className="h-10 w-auto w-full" />
        
      </div> 
      <div>
        <h3  className="  font-bold animate-colorChange">PASSWORD WILL EXPIRE IN 3 DAYS!!</h3>
      </div>
     
     
         <div className="flex items-end gap-4 ">
          <div>
            {onAddClick&&(
              <button 
                onClick={onAddClick}
                className="bg-sky-700 hover:bg-sky-600 text-white px-4 py-1  rounded-md text-sm transition " >
                Add
              </button>
            )}
          </div>
          <div>
  
         <Link href="/login">
         <button 
          className="bg-sky-700 hover:bg-sky-600 text-white px-4 py-1  rounded-md text-sm transition " >
          Log<TbLogout className="inline-block" />
            
          </button>
          </Link>
          </div>
</div>
   
      
    </header>
  );
}
