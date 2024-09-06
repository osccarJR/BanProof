import React from "react";
import { FaCheck } from "react-icons/fa"; 
export const CheckmarkIcon = ({ size = 20, ...props }) => {
  return (
    <FaCheck
      size={size}
      style={{color: 'green'}}
      {...props}
    />
  );
};
