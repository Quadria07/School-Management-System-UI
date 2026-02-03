import React from 'react';
import { StaffMember } from './StaffDirectory';
import { MapPin, Phone, Globe, Mail } from 'lucide-react';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';

interface StaffIDCardProps {
  staff: StaffMember;
}

export const StaffIDCard: React.FC<StaffIDCardProps> = ({ staff }) => {
  // CR80 card ratio 85.6mm x 53.98mm
  // Scaled for web display
  
  return (
    <div className="staff-id-card-component flex flex-col gap-8 items-center justify-center p-4 bg-gray-50 print:bg-white print:p-0 print:gap-4">
      
      {/* FRONT SIDE */}
      <div className="w-[480px] h-[302px] bg-white rounded-xl shadow-lg relative overflow-hidden flex flex-col border border-gray-200 print:shadow-none print:border-gray-300">
        {/* Background Design */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/5 rounded-bl-[120px] z-0 print:bg-blue-900/10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-tr-[120px] z-0 print:bg-amber-500/10"></div>
        
        {/* WATERMARK LOGO */}
        <div className="absolute right-[-30px] bottom-[-30px] w-72 h-72 opacity-[0.08] z-0 pointer-events-none">
           <img src={schoolLogo} alt="" className="w-full h-full object-contain grayscale" />
        </div>
        
        {/* Left Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-blue-950 z-20 print:bg-blue-950"></div>

        {/* Content Container */}
        <div className="relative z-10 pl-8 pr-6 pt-5 pb-5 h-full flex flex-col">
          
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-4 border-b-[3px] border-amber-500 pb-3">
            <div className="w-14 h-14 flex-shrink-0">
              <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-[14px] font-extrabold text-blue-950 uppercase leading-tight tracking-wide">
                Bishop Felix Owolabi Int'l Academy
              </h1>
              <p className="text-[9px] text-gray-700 leading-tight mt-1 font-medium">
                1, Faithtriumph Drive, Behind Galaxy Hotel, West Bye Pass, Ring Road, Osogbo, Osun State
              </p>
              <p className="text-[9px] font-bold text-blue-900 italic mt-1">
                ...learning for an Exceptional Nation
              </p>
            </div>
          </div>

          <div className="flex gap-5 flex-1">
             {/* Photo Column - Made taller to cover space */}
             <div className="flex flex-col items-center gap-2 w-[140px]">
              <div className="w-[140px] h-[170px] bg-gray-100 rounded-lg border-[3px] border-blue-950 overflow-hidden flex items-center justify-center shadow-md print:bg-gray-50 print:shadow-none">
                {/* Check if photo is an emoji or a URL */}
                {staff.photo && (staff.photo.startsWith('http') || staff.photo.startsWith('data:')) ? (
                   <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                ) : (
                   <span className="text-8xl" role="img" aria-label="staff photo">{staff.photo}</span>
                )}
              </div>
            </div>

            {/* Details Column */}
            <div className="flex-1 flex flex-col justify-center space-y-3.5">
              <div className="space-y-1 border-l-[3px] border-amber-500 pl-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Staff Name</p>
                <p className="text-[17px] font-extrabold text-blue-950 leading-tight">{staff.name}</p>
              </div>

              <div className="space-y-1 pl-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Designation</p>
                <p className="text-[13px] font-bold text-gray-800 leading-tight">{staff.role}</p>
                <p className="text-[11px] font-medium text-gray-600 leading-tight">{staff.department}</p>
              </div>

              <div className="flex gap-4 pl-3 items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Staff ID</p>
                  <p className="text-[14px] font-mono font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 print:border-blue-200">{staff.employeeId}</p>
                </div>
                
                {/* Signature moved here */}
                <div className="flex-1 ml-2 border-b border-blue-950 pb-0.5 text-center flex items-end justify-center h-8">
                   {staff.signature && (staff.signature.startsWith('http') || staff.signature.startsWith('data:')) ? (
                      <img src={staff.signature} alt="Signature" className="h-full object-contain mix-blend-multiply" />
                   ) : (
                      <div className="font-script text-xl text-blue-900 leading-none" style={{ fontFamily: 'cursive' }}>
                          {staff.name.split(' ')[0]}
                       </div>
                   )}
                </div>
              </div>
              
              <div className="mt-auto pl-3 flex justify-between items-end">
                  <div className="inline-block bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm tracking-wide print:shadow-none">
                    STAFF
                  </div>
                  <p className="text-[6px] text-gray-500 uppercase font-bold tracking-wide mr-2">Holder's Signature</p>
              </div>
            </div>
          </div>
          
           {/* Footer Strip */}
           <div className="absolute bottom-0 left-4 right-0 h-6 bg-blue-950 flex items-center justify-between px-5 z-20 print:bg-blue-950">
              <p className="text-[9px] text-white tracking-widest uppercase font-bold">Official Identity Card</p>
              <p className="text-[9px] text-amber-400 font-bold">EXP: DEC 2026</p>
           </div>
        </div>
      </div>

      {/* BACK SIDE */}
      <div className="w-[480px] h-[302px] bg-white rounded-xl shadow-lg relative overflow-hidden flex flex-col border border-gray-200 print:shadow-none print:border-gray-300 print:break-before-page">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:12px_12px]"></div>
         
         {/* WATERMARK LOGO FOR BACK SIDE */}
         <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-[0.06] z-0 pointer-events-none">
           <img src={schoolLogo} alt="" className="w-full h-full object-contain grayscale" />
         </div>

         <div className="relative z-10 p-6 flex flex-col h-full items-center text-center justify-between">
            {/* Header */}
            <div className="mt-1">
               <img src={schoolLogo} alt="Logo" className="h-10 object-contain mx-auto mb-2 opacity-90" />
               <h2 className="text-[12px] font-extrabold text-blue-950 uppercase tracking-widest border-b-2 border-amber-500 pb-2 px-8 inline-block">Property of BFOIA</h2>
            </div>

            {/* Terms - Reduced Spacing */}
            <div className="space-y-2 text-[10px] text-gray-700 leading-tight px-6 font-medium max-w-sm mx-auto">
              <p>This identity card remains the property of <span className="font-bold text-blue-950">Bishop Felix Owolabi International Academy</span>.</p>
              <p>If found, please return to the address below or contact the phone number provided.</p>
              <p className="text-red-600 font-semibold">This card is not transferable.</p>
            </div>

            {/* Address & Contact - Centered and detailed - Full Address */}
            <div className="w-full bg-blue-50/80 rounded-lg p-3 border border-blue-100 mt-2 mb-2 print:bg-blue-50">
              <div className="flex flex-col items-center gap-1.5 text-[10px] text-gray-700 font-semibold">
                 <div className="flex items-start gap-2 justify-center text-center">
                    <MapPin className="w-3.5 h-3.5 text-blue-950 mt-0.5 flex-shrink-0" />
                    <span className="max-w-[300px] leading-tight">1, Faithtriumph Drive, Behind Galaxy Hotel, West Bye Pass, Ring Road, Osogbo, Osun State</span>
                 </div>
                 <div className="flex flex-row gap-6 mt-1">
                    <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-blue-950" />
                        <span>+234 803 123 4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-950" />
                        <span>www.bfoia.edu.ng</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-950" />
                    <span>info@bfoia.edu.ng</span>
                 </div>
              </div>
            </div>
            
            {/* Bottom Bar */}
             <div className="absolute bottom-0 left-0 right-0 h-3 bg-amber-500 print:bg-amber-500"></div>
         </div>
      </div>
    </div>
  );
};