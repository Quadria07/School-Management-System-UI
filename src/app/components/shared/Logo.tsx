import React from 'react';
import { GraduationCap } from 'lucide-react';
import schoolLogoImg from 'figma:asset/05e5dcd127c3f9119091f655ee2db41390342c66.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'white';
}

const sizeMap = {
  sm: { container: 'w-12 h-12', text: 'text-lg' },
  md: { container: 'w-16 h-16', text: 'text-2xl' },
  lg: { container: 'w-20 h-20', text: 'text-3xl' },
  xl: { container: 'w-24 h-24', text: 'text-4xl' }
};

export function Logo({ size = 'md', showText = true, className = '', variant = 'default' }: LogoProps) {
  const sizes = sizeMap[size];
  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizes.container} flex items-center justify-center`}>
        <img src={schoolLogoImg} alt="BFOIA Logo" className="w-full h-full object-contain" />
      </div>
      {showText && (
        <div>
          <h1 className={`${sizes.text} font-bold ${isWhite ? 'text-white' : 'text-[#003366]'}`}>
            BFOIA
          </h1>
          {size !== 'sm' && (
            <p className={`text-xs ${isWhite ? 'text-blue-200' : 'text-gray-600'}`}>
              School Management System
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Compact logo for report cards and official documents
export function CompactLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src={schoolLogoImg} alt="BFOIA Logo" className="w-full h-full object-contain" />
    </div>
  );
}

// Full school header for official documents
interface SchoolHeaderProps {
  className?: string;
  showMotto?: boolean;
}

export function SchoolHeader({ className = '', showMotto = true }: SchoolHeaderProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="w-20 h-20 flex-shrink-0">
        <CompactLogo className="w-full h-full" />
      </div>
      <div className="text-center flex-1">
        <h1 className="text-2xl font-bold text-[#003366] leading-tight">
          BISHOP FELIX OWOLABI INTERNATIONAL ACADEMY
        </h1>
        <p className="text-sm text-gray-700 mt-1">
          P.M.B 1234, Osogbo, Osun State, Nigeria
        </p>
        <p className="text-xs text-gray-600">
          Tel: +234 803 456 7890 | Email: info@bfoia.edu.ng
        </p>
        {showMotto && (
          <p className="text-xs font-semibold text-[#003366] mt-1 italic">
            MOTTO: Learning for an Exceptional Nation
          </p>
        )}
      </div>
    </div>
  );
}

// Export the school logo for direct use
export { schoolLogoImg };