import React from "react";
import { FaTimes } from "react-icons/fa";
export const CrossmarkIcon = ({ size = 20, ...props }) => {
  const {isSelected, isIndeterminate, disableAnimation, ...otherProps} = props;
  return (
    <FaTimes
      size={size}
      style={{color: 'red'}}
      {...otherProps}
    />
  );
};