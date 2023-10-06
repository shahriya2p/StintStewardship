import React, { useEffect, useState } from 'react';
import './Icons.css';
import { NavLink } from 'react-router-dom';
const icons = [
  {
    id: 1,
    name: 'Home',
    path: '/home',
    svg: `<svg width="30" height="28" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.9748 23.8571V36H2V14.1429L19.9623 2L37.9245 14.1429V36H25.9497V23.8571H13.9748Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `,
  },
  {
    id: 2,
    name: 'Tasks',
    path: '/tasks',
    svg: `<svg width="30" height="28" viewBox="0 0 39 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 31.1667C12 31.1667 12 24.8261 19.5 24.8261C27 24.8261 27 31.1667 27 31.1667H12ZM2 2V23.558H37V2H2Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
  {
    id: 3,
    name: 'Personal',
    path: '/personal',
    svg: `<svg width="30" height="28" viewBox="0 0 41 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.2222 22.7778C24.7778 22.7778 29.3333 17.8889 29.3333 11.7778C29.3333 5.66667 26.2963 2 20.2222 2C14.1481 2 11.1111 5.66667 11.1111 11.7778C11.1111 17.8889 15.6667 22.7778 20.2222 22.7778ZM20.2222 22.7778C29.3333 22.7778 38.4444 24 38.4444 35H2C2 24 11.1111 22.7778 20.2222 22.7778Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
  {
    id: 4,
    name: 'Activities',
    path: '/activities',
    svg: `<svg width="30" height="28" viewBox="0 0 47 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 16.9839H14.5417L19.9167 31.9678L27.0833 2L32.4583 16.9839H45" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
  {
    id: 5,
    name: 'Logout',
    path: '/logout',
    svg: `<svg width="30" height="28" className="logout" viewBox="0 0 43 39" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M41 19.5H9.8M41 19.5L28.52 7.83333M41 19.5L28.52 31.1667M14.48 37H2V2H14.48" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
];
const iconsT = [
  {
    id: 1,
    name: 'Home',
    path: '/home',
    svg: `<svg width="33" height="28" viewBox="0 0 40 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.9748 23.8571V36H2V14.1429L19.9623 2L37.9245 14.1429V36H25.9497V23.8571H13.9748Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `,
  },
  {
    id: 2,
    name: 'Personal',
    path: '/personal',
    svg: `<svg width="31" height="28" viewBox="0 0 40 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.2222 22.7778C24.7778 22.7778 29.3333 17.8889 29.3333 11.7778C29.3333 5.66667 26.2963 2 20.2222 2C14.1481 2 11.1111 5.66667 11.1111 11.7778C11.1111 17.8889 15.6667 22.7778 20.2222 22.7778ZM20.2222 22.7778C29.3333 22.7778 38.4444 24 38.4444 35H2C2 24 11.1111 22.7778 20.2222 22.7778Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
  {
    id: 3,
    name: 'Announcement',
    path: '/announce',
    svg: `<svg width="75" height="76" viewBox="13 21 85 74" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_164_2)">
    <path d="M22.125 24.7833L24.8063 27.1667C26.5125 25.65 28.8938 24.7 31.5 24.7C34.1062 24.7 36.4875 25.65 38.1937 27.1667L40.875 24.7833C38.475 22.65 35.1563 21.3333 31.5 21.3333C27.8437 21.3333 24.525 22.65 22.125 24.7833ZM31.5 14.6667C25.8375 14.6667 20.7 16.7167 16.9688 20.0167L19.6125 22.3667C22.65 19.6667 26.8687 18 31.5 18C36.1313 18 40.35 19.6667 43.3875 22.3667L46.0312 20.0167C42.3 16.7167 37.1625 14.6667 31.5 14.6667ZM36.8625 29.6833L26.1375 29.6667C24.9563 29.6667 24 30.5167 24 31.5667V47.75C24 48.8 24.9563 49.65 26.1375 49.65H36.8438C38.025 49.65 38.9812 48.8 38.9812 47.75V31.5667C39 30.5167 38.0437 29.6833 36.8625 29.6833ZM37.125 46.3333H25.875V33H37.125V46.3333Z" fill="black"/>
    </g>
    <defs>
    <filter id="filter0_d_164_2" x="0" y="0" width="70" height="74" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dx="4" dy="4"/>
    <feGaussianBlur stdDeviation="2"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.34 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_164_2"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_164_2" result="shape"/>
    </filter>
    <clipPath id="clip0_164_2">
    <rect width="45" height="40" fill="white" transform="translate(9 13)"/>
    </clipPath>
    </defs>
    </svg>
    `,
  },
  {
    id: 4,
    name: 'Task+',
    path: '/addTask',
    svg: `<svg width="30" height="30" className="add-task-logo" viewBox="0 2 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_116_3)">
    <path d="M44 10.36L21.18 33.2L12.7 24.72L15.52 21.9L21.18 27.56L41.18 7.56L44 10.36ZM24 40C15.18 40 8 32.82 8 24C8 15.18 15.18 8 24 8C27.14 8 30.08 8.92 32.56 10.5L35.46 7.6C32.2 5.34 28.26 4 24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C27.46 44 30.72 43.12 33.56 41.56L30.56 38.56C28.56 39.48 26.34 40 24 40ZM38 30H32V34H38V40H42V34H48V30H42V24H38V30Z" fill="black"/>
    </g>
    <defs>
    <clipPath id="clip0_116_3">
    <rect width="48" height="48" fill="white"/>
    </clipPath>
    </defs>
    </svg>    
    `,
  },
  {
    id: 5,
    name: 'Review',
    path: '/review',
    svg: `<svg width="50" height="50" viewBox="11 6 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_167_105)">
    <path d="M39.5833 6.25H10.4167C8.10417 6.25 6.25 8.125 6.25 10.4167V39.5833C6.25 41.875 8.10417 43.75 10.4167 43.75H39.5833C41.875 43.75 43.75 41.875 43.75 39.5833V10.4167C43.75 8.125 41.8958 6.25 39.5833 6.25ZM39.5833 39.5833H10.4167V14.5833H39.5833V39.5833ZM28.125 27.0833C28.125 28.8125 26.7292 30.2083 25 30.2083C23.2708 30.2083 21.875 28.8125 21.875 27.0833C21.875 25.3542 23.2708 23.9583 25 23.9583C26.7292 23.9583 28.125 25.3542 28.125 27.0833ZM25 18.75C19.3125 18.75 14.4583 22.2083 12.5 27.0833C14.4583 31.9583 19.3125 35.4167 25 35.4167C30.6875 35.4167 35.5417 31.9583 37.5 27.0833C35.5417 22.2083 30.6875 18.75 25 18.75ZM25 32.2917C22.125 32.2917 19.7917 29.9583 19.7917 27.0833C19.7917 24.2083 22.125 21.875 25 21.875C27.875 21.875 30.2083 24.2083 30.2083 27.0833C30.2083 29.9583 27.875 32.2917 25 32.2917Z" fill="black"/>
    </g>
    <defs>
    <clipPath id="clip0_167_105">
    <rect width="50" height="50" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    
    `,
  },
  {
    id: 6,
    name: 'Logout',
    path: '/logout',
    svg: `<svg width="30" height="30" className="logout" viewBox="-4 0 45 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M41 19.5H9.8M41 19.5L28.52 7.83333M41 19.5L28.52 31.1667M14.48 37H2V2H14.48" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  },
];
const Icons = ({ isExpanded, onLogout }) => {
  const token = localStorage.getItem('authToken');
  const [role, setRole] = useState();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setRole(payload.role);
    }
  }, [role]);
  return (
    <>
      {isExpanded ? (
        <div className='icon-main'>
          {role === 'student' &&
            icons.map((icon) => {
              if (icon.name === 'Logout') {
                if (!token) {
                  return null;
                }
                return (
                  <NavLink
                    to={icon.path}
                    key={icon.id}
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                    onClick={onLogout}
                  >
                    <div key={icon.id} className={`icon-container`}>
                      <svg
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='icons'
                      />

                      <span className='icon-name'>{icon.name}</span>
                    </div>
                  </NavLink>
                );
              }
              if (token) {
                return (
                  <NavLink
                    to={icon.path}
                    key={icon.id}
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                  >
                    <div key={icon.id} className={`icon-container`}>
                      <svg
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='icons'
                      />

                      <span className='icon-name'>{icon.name}</span>
                    </div>
                  </NavLink>
                );
              } else {
                return null;
              }
            })}
          {role === 'teacher' &&
            iconsT.map((icon) => {
              if (icon.name === 'Logout') {
                if (!token) {
                  return null;
                }
                return (
                  <NavLink
                    to={icon.path}
                    key={icon.id}
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                    onClick={onLogout}
                  >
                    <div key={icon.id} className={`icon-container`}>
                      <svg
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='icons'
                      />

                      <span className='icon-name'>{icon.name}</span>
                    </div>
                  </NavLink>
                );
              }
              if (token) {
                return (
                  <NavLink
                    to={icon.path}
                    key={icon.id}
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                  >
                    <div key={icon.id} className={`icon-container`}>
                      <svg
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='icons'
                      />

                      <span className='icon-name'>{icon.name}</span>
                    </div>
                  </NavLink>
                );
              } else {
                return null;
              }
            })}
        </div>
      ) : (
        <div className='icon-main'>
          {role === 'student' &&
            icons.map((icon) => {
              if (icon.name === 'Logout') {
                if (!token) {
                  return null;
                }
                return (
                  <NavLink
                    to={icon.path}
                    key={icon.id}
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                    onClick={onLogout}
                  >
                    <div key={icon.id} className={`icon-back`}>
                      <svg
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='icons'
                      />
                    </div>
                  </NavLink>
                );
              }
              if (token) {
                return (
                  <NavLink
                    to={icon.path}
                    key={icon.id}
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                  >
                    <div key={icon.id} className={`icon-back`}>
                      <svg
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='icons'
                      />
                    </div>
                  </NavLink>
                );
              } else {
                return null;
              }
            })}
          {role === 'teacher' &&
            iconsT.map((icon) => {
              if (icon.name === 'Logout') {
                if (!token) {
                  return null;
                }
                return (
                  <NavLink
                    to={icon.path}
                    key={icon.id}
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                    onClick={onLogout}
                  >
                    <div key={icon.id} className={`icon-back`}>
                      <svg
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='icons'
                      />
                    </div>
                  </NavLink>
                );
              }
              if (token) {
                return (
                  <NavLink
                    to={icon.path}
                    key={icon.id}
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                  >
                    <div key={icon.id} className={`icon-back`}>
                      <svg
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='icons'
                      />
                    </div>
                  </NavLink>
                );
              } else {
                return null;
              }
            })}
        </div>
      )}
    </>
  );
};

export default Icons;
