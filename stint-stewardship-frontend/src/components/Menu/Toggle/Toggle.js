import React from 'react';
import './Toggle.css';
const Toggle = (props) => {
  const { isExpanded, toggleMenu } = props;

  return (
    <div className={`toggle ${isExpanded ? 'expand' : ''}`}>
      <button className='align' onMouseOver={toggleMenu}>
        <svg
          width='25'
          height='18'
          viewBox='0 0 25 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1 1H23.9383M1 8.6461H23.9383M1 16.2922H23.9383'
            stroke='black'
            strokeWidth='1.91153'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
    </div>
  );
};

export default Toggle;
