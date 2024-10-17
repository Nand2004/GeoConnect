import React, { useState } from 'react';

const users = [
  { name: 'Sam Edwards', avatar: '/path/to/avatar1.png' },
  { name: 'Rebecca Barker', avatar: '/path/to/avatar2.png' },
  { name: 'Alyssa Davis', avatar: '/path/to/avatar3.png' },
  { name: 'Jack John', avatar: '/path/to/avatar4.png' },
  { name: 'Felix Forbes', avatar: '/path/to/avatar5.png' },
];

function Sidebar({ onSelectUser }) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">
      <input 
        type="text" 
        className="search-bar" 
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="user-list">
        {filteredUsers.map(user => (
          <li key={user.name} onClick={() => onSelectUser(user)}>
            <img src={user.avatar} alt={user.name} className="avatar" />
            <span>{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
