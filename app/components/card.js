// components/ui/card.js
import React from 'react';
import PropTypes from 'prop-types';

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const Card = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-slate-900/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-white/10",
      className
    )}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
};

// PropTypes for validation
Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
