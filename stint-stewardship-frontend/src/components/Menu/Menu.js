import React, { Fragment } from 'react';
import './Menu.css';
import Toggle from './Toggle/Toggle';
import Icons from './Icons/Icons';
const Menu = (props) => {
  const { setIsExpanded, isExpanded, onLogout } = props;
  const toggleMenu = () => {
    setIsExpanded(true);
  };
  return (
    <Fragment>
      <Toggle
        isExpanded={isExpanded}
        toggleMenu={toggleMenu}
        setIsExpanded={setIsExpanded}
      />

      <div className={`menu ${isExpanded ? 'expanded' : 'short'}`}>
        <Icons isExpanded={isExpanded} onLogout={onLogout} />
      </div>
    </Fragment>
  );
};

export default Menu;
