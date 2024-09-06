import React from "react";
import { FaTimes } from "react-icons/fa";
export const CrossmarkIcon = ({ size = 20, ...props }) => {
  
  return (
    <FaTimes
      size={size}
      style={{color: 'red'}}
      {...props}
    />
  );
};