import React, { useState, useEffect, watch } from 'react';

const Toast = ({ showToast, message }) => {
    useEffect(() => {
        console.log('showToast::', showToast)
        if (showToast) {
            // 在这里可以添加一些动画效果或其他操作
            console.log('Toast is visible!');
        }
    }, [showToast]);

    return (
        <>
            {showToast && (
                <div style={toastStyle}>
                    <p>{message}</p>
                </div>
            )}
        </>
    );
};

const toastStyle = {
    position: 'fixed',
    bottom: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '10px 30px',
    backgroundColor: 'rgba(255,255,255, 1)',
    color: '#000',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    zIndex: '999',
};

export default Toast