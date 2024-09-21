import React from 'react';

const Link = ({ value, onChange }) => {
    return (
        <div>
            <label>Link:</label>
            <input 
                type="url" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                placeholder="Enter a valid URL" 
            />
        </div>
    );
};

export default Link;
