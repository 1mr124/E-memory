import React from 'react';

const Text = ({ value, onChange }) => {
    return (
        <div>
            <label>Text:</label>
            <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                placeholder="Enter your text here" 
            />
        </div>
    );
};

export default Text;
