import React, { useEffect, useState } from 'react';
import SearchPanel from './search-panel/SearchPanel';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
const Navbar = (props) => {
  const { setIsExpanded, token } = props;
  const [token1, setToken1] = useState('');
  useEffect(() => {
    setToken1(token);
  }, [token1, token]);
  const handle = () => {
    setIsExpanded(false);
  };
  return (
    <div className='navbar' onMouseOver={handle}>
      <Link to='/home'>
        <svg
          width='67'
          height='32'
          viewBox='0 0 67 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='logo-svg'
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

        <h3 className='logo'>StintStewardship</h3>
      </Link>
      {token && <SearchPanel />}
      {!token1 && (
        <div className='nav'>
          <>
            <NavLink
              to='/login'
              className={({ isActive, isPending }) =>
                isPending ? 'link' : isActive ? 'active-log' : 'link'
              }
            >
              <h5 id='nav'>LogIn</h5>
            </NavLink>
            <NavLink
              to='/signup'
              className={({ isActive, isPending }) =>
                isPending ? 'link' : isActive ? 'active-log' : 'link'
              }
            >
              <h5 id='nav'>SignUp</h5>
            </NavLink>
          </>
        </div>
      )}
    </div>
  );
};

export default Navbar;
