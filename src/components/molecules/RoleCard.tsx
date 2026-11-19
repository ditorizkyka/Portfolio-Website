import React from 'react';

export interface RoleData {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const RoleCard = ({ role }: { role: RoleData }) => (
  <div className="bg-portfolio-surface border border-portfolio-border rounded-xl md:rounded-2xl p-4 md:p-8
                  hover:bg-portfolio-surface/50 transition-all duration-300 hover:border-portfolio-border-strong">
    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
      <RoleIconWrapper>{role.icon}</RoleIconWrapper>
      <h3 className="text-base md:text-2xl font-semibold text-portfolio-ink">
        {role.title}
      </h3>
    </div>
    <p className="text-portfolio-muted text-sm md:text-base leading-relaxed">
      {role.description}
    </p>
  </div>
);

interface RoleIconWrapperProps {
  children: React.ReactNode;
}

const RoleIconWrapper = ({ children }: RoleIconWrapperProps) => (
  <div className="bg-portfolio-role-icon p-2 md:p-3 rounded-lg md:rounded-xl flex items-center justify-center">
    <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
      {children}
    </div>
  </div>
);

export default RoleCard;