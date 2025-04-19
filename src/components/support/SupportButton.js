import React, { useState } from 'react';
import ContactSupport from './ContactSupport';
import './ContactSupport.css';

const SupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return React.createElement(React.Fragment, null,
    React.createElement('button', {
      className: 'support-button',
      onClick: () => setIsOpen(true),
      'aria-label': 'Contact Support'
    },
      React.createElement('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      },
        React.createElement('path', {
          d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'
        })
      )
    ),
    isOpen && React.createElement(ContactSupport, { onClose: () => setIsOpen(false) })
  );
};

export default SupportButton; 