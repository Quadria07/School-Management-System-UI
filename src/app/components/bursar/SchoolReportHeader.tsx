import React from 'react';
import schoolLogo from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';

export const SchoolReportHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <div className="w-full mb-4">
      {/* School Header Box */}
      <div className="border border-blue-950 p-2 mb-2 bg-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
          {/* School Logo */}
          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
            <img
              src={schoolLogo}
              alt="BFOIA Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* School Info */}
          <div className="flex-1 text-center">
            <h1 className="text-base font-bold text-blue-950 mb-0">
              BISHOP FELIX OWOLABI INT'L ACADEMY
            </h1>
            <p className="text-[10px] text-gray-700 mb-0 leading-tight">
              1, Faithtriumph Drive, Behind Galaxy Hotel, West
              Bye Pass, Ring Road, Osogbo, Osun State
            </p>
            <p className="text-[10px] font-semibold text-blue-900 mt-1">
              MOTTO: ...learning for an Exceptional Nation
            </p>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="border border-gray-400">
        <div className="bg-gray-200 p-1.5 text-center">
          <h2 className="text-sm font-bold text-blue-950 uppercase">
            {title}
          </h2>
          {subtitle && (
             <p className="text-xs text-gray-600 mt-1 uppercase font-medium">
                {subtitle}
             </p>
          )}
        </div>
      </div>
    </div>
  );
};