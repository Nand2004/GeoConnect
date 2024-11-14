import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, ListGroupItem, Form, Alert } from 'react-bootstrap';
import { BsPlusLg, BsXLg, BsSearch, BsPeople, BsPersonPlus } from 'react-icons/bs';
import axios from 'axios';

const GroupManagementModal = ({
  show,
  onHide,
  chatId,
  currentUser,
  onUserRemoved,
  onUserAdded
}) => {
  const [groupUsers, setGroupUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/chat/chatGetByChatId/${chatId}`);
        const chatWithUsernames = await Promise.all(
          response.data.users.map(async (user) => {
            const usernameResponse = await axios.get(`http://localhost:8081/user/getUsernameByUserId/${user.userId}`);
            return { userId: user.userId, username: usernameResponse.data.username };
          })
        );
        setGroupUsers(chatWithUsernames);
      } catch (error) {
        console.error('Error fetching group members:', error);
        setError('Error fetching group members.');
      }
    };

    if (show) {
      fetchGroupUsers();
    }
  }, [chatId, show]);

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8081/user/userSearchUser?username=${searchText}`
      );
      const filteredResults = data.filter(
        (user) => !groupUsers.some((u) => u.userId === user._id)
      );
      setSearchResults(filteredResults);
      setError('');
    } catch {
      setError('Error searching for users.');
    }
  };

  const handleAddUser = async (user) => {
    try {
      const { data } = await axios.post(`http://localhost:8081/chat/chatAddGroupUser/${chatId}`, {
        userId: user._id
      });
      setGroupUsers(data.chat.users);
      onUserAdded(data.chat.users.find(u => u.userId === user._id));
    } catch (error) {
      console.error('Error adding user to group:', error);
      setError('Error adding user to group.');
    }
  };

  const handleRemoveUser = async (user) => {
    try {
      await axios.post(`http://localhost:8081/chat/chatRemoveGroupUser/${chatId}`, {
        userId: user.userId
      });
      setGroupUsers(prevUsers => prevUsers.filter(u => u.userId !== user.userId));
      onUserRemoved(user);
    } catch (error) {
      console.error('Error removing user from group:', error);
      setError('Error removing user from group.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="group-management-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold">
          <BsPeople className="me-2 mb-1" />
          Manage Group Members
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        <div className="search-container mb-4">
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Search for users"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input pe-5"
            />
            <Button 
              variant="link" 
              className="search-button"
              onClick={handleSearch}
            >
              <BsSearch />
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger" className="mb-3 py-2">{error}</Alert>}

        <div className="section-container">
          <h5 className="section-title">
            <BsPeople className="me-2 mb-1" />
            Current Members
          </h5>
          <ListGroup className="custom-list-group">
            {groupUsers.map((user) => (
              <ListGroupItem
                key={user.userId}
                className="custom-list-item"
              >
                <div className="user-avatar">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user.username || user.userId}</span>
                {user.userId !== currentUser.id && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="remove-button"
                    onClick={() => handleRemoveUser(user)}
                  >
                    <BsXLg />
                  </Button>
                )}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>

        {searchResults.length > 0 && (
          <div className="section-container mt-4">
            <h5 className="section-title">
              <BsPersonPlus className="me-2 mb-1" />
              Add New Members
            </h5>
            <ListGroup className="custom-list-group">
              {searchResults.map((user) => (
                <ListGroupItem
                  key={user._id}
                  className="custom-list-item"
                >
                  <div className="user-avatar">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{user.username}</span>
                  <Button
                    variant="success"
                    size="sm"
                    className="add-button"
                    onClick={() => handleAddUser(user)}
                  >
                    <BsPlusLg />
                  </Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        )}
      </Modal.Body>
      <style jsx global>{`
        .group-management-modal .modal-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .group-management-modal .modal-header {
          background: transparent;
          padding: 1.5rem 1.5rem 0.5rem;
        }

        .group-management-modal .modal-title {
          font-size: 1.5rem;
          color: #2c3e50;
        }

        .search-container {
          position: relative;
        }

        .search-input {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
          border-color: #4299e1;
        }

        .search-button {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          color: #4a5568;
          padding: 0.25rem 0.5rem;
        }

        .section-title {
          font-size: 1.1rem;
          color: #4a5568;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .custom-list-group {
          max-height: 300px;
          overflow-y: auto;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .custom-list-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border: none;
          background: rgba(255, 255, 255, 0.8);
          margin-bottom: 4px;
          border-radius: 8px !important;
          transition: all 0.2s ease;
        }

        .custom-list-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 12px;
        }

        .user-name {
          flex: 1;
          font-size: 0.95rem;
          color: #2d3748;
        }

        .remove-button, .add-button {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.2s ease;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .custom-list-item:hover .remove-button,
        .custom-list-item:hover .add-button {
          opacity: 1;
          transform: scale(1);
        }

        .remove-button {
          background: #feb2b2;
          border: none;
          color: #c53030;
        }

        .add-button {
          background: #9ae6b4;
          border: none;
          color: #2f855a;
        }

        .remove-button:hover {
          background: #fc8181;
          color: #9b2c2c;
        }

        .add-button:hover {
          background: #68d391;
          color: #276749;
        }

        /* Custom scrollbar */
        .custom-list-group::-webkit-scrollbar {
          width: 6px;
        }

        .custom-list-group::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }

        .custom-list-group::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        .custom-list-group::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </Modal>
  );
};

export default GroupManagementModal;