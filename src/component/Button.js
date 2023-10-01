import React from 'react';
import PropTypes from 'prop-types'
import './style.scss'

const Button = (props) => {
  const { label, onClick, disabled, style, size } = props;

  const buttonSizeClass = size === 'small' ? 'button-small' : size === 'large' ? 'button-large' : '';

  return (
    <button
      className={`button ${style} ${buttonSizeClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

Button.defaultProps = {
  disabled: false,
  style: '',
  size: 'medium',
};

export default Button
