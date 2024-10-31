// components/ui/card.js
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export const Card = ({ children, className }) => {
  return (
    <div className={clsx("bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg", className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={clsx("p-6", className)}>
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
