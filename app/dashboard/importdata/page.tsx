"use client";
import { useEffect, useRef } from "react";
import ShifaForm from "../patient/shifa/Addformshifa"; //  Path of shifa form
import type { ShifaFormData, ShifaFormRef } from "../patient/shifa/Addformshifa";
import { useRouter } from "next/navigation";

export default function NewModalPage() {
  // 1. Ref banaya jo ShifaForm ke andar ghuse ga
  const formRef = useRef<ShifaFormRef>(null);
  const router = useRouter();

  useEffect(() => {
    // 2. LocalStorage se data pakra
    const savedData = localStorage.getItem("tempimport");
    
    if (savedData && formRef.current) {
      try {
        const parsedData = JSON.parse(savedData);
        
        //  useImperativeHandle wala "fillData" function call kiya
        formRef.current.fillData(parsedData);
        
        // Kaam hone ke baad temporary storage saaf kar di
        localStorage.removeItem("tempimport");
      } catch (error) {
        console.error("Data parse karne mein error:", error);
      }
    }
  }, []);

  const handleFinalSave = (data: ShifaFormData) => {
    console.log("Final Submitted Data:", data);
    alert("Data imported and saved successfully!");
    router.push("/shifa"); // Wapis main table par bhej diya
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-sm overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-sky-700 text-white px-5 py-3 font-semibold flex justify-between items-center">
          <span>Imported Patient Registration Form</span>
          <button onClick={() => router.back()} className="text-sm bg-sky-600 px-2 py-1 rounded">Back</button>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-6">
            <p className="text-blue-700 text-xs font-medium">
              Information has been imported from the previous record. 
            </p>
          </div>
          
          {/* ✅ 5. Form ko Ref pass kiya aur onSave handle kiya */}
          <ShifaForm 
            ref={formRef} 
            onSave={handleFinalSave} 
            onCancel={() => router.back()} 
          />
        </div>
      </div>
    </div>
  );
}
