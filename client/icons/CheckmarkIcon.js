import React from "react";
import { FaCheck } from "react-icons/fa"; 
export const CheckmarkIcon = ({ size = 20, ...props }) => {
  const {isSelected, isIndeterminate, disableAnimation, ...otherProps} = props;
  return (
    <FaCheck
      size={size}
      style={{color: 'green'}}
      {...otherProps}
    />
  );
};
