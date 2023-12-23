import React, { useState } from 'react';

const Dropdown = ({ schools, onUrlSelect }) => {
  const [selectedSchool, setSelectedSchool] = useState('');

  const handleChange = (event) => {
    const selectedSchoolName = event.target.value;
    const school = schools.find(s => s.name === selectedSchoolName);
    setSelectedSchool(selectedSchoolName);
    if (school) {
      onUrlSelect(school.url);
    }
  };

  return (
    <select onChange={handleChange} value={selectedSchool}>
      <option value="">Select a School</option>
      {schools.map((school, index) => (
        <option key={index} value={school.name}>{school.name}</option>
      ))}
    </select>
  );
};

export default Dropdown;
