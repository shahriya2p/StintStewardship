import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
const Footer = () => {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <footer className='footer'>
      <svg
        width='67'
        height='32'
        viewBox='0 0 67 32'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='footer-logo-svg'
        onClick={scrollTop}
      >
        <g clipPath='url(#clip0_64_168)'>
          <path
            d='M47.673 0H66.5705L50.25 32H31.3525L47.673 0Z'
            fill='#FF7A00'
          />
          <path
            d='M30.4934 0H44.237L27.9165 32H14.1729L30.4934 0Z'
            fill='#FF9736'
          />
          <path
            d='M16.7502 0H27.0579L10.7374 32H0.429688L16.7502 0Z'
            fill='#FFBC7D'
          />
        </g>
        <defs>
          <clipPath id='clip0_64_168'>
            <rect width='67' height='32' fill='white' />
          </clipPath>
        </defs>
      </svg>
      <Link onClick={scrollTop} style={{ textDecoration: 'none' }}>
        <h3 className='footer-logo'>StintStewardship</h3>
      </Link>
      <div>
        <h6
          style={{ color: 'white', position: 'absolute', right: 100, top: 50 }}
        >
          Solely Developed By SupportTeam
        </h6>
      </div>
    </footer>
  );
};

export default Footer;
