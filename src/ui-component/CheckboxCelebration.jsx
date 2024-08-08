import React from 'react';

const CheckboxToggle = ({ checked, onChange }) => {
  return (
    <label className="container">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
      />
      <div className="checkmark"></div>
    </label>
  );
};

export default CheckboxToggle;
