import React from 'react';

const Pic = ({ value, onChange }) => {
    return (
        <div>
            <label>Picture:</label>
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => onChange(e.target.files[0])} 
            />
        </div>
    );
};

export default Pic;
