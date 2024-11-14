import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, ListGroupItem, Form, Alert } from 'react-bootstrap';
import { BsPlusLg, BsXLg } from 'react-icons/bs';
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
        setGroupUsers(response.data.users);
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
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Manage Group Members</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search for users"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="primary" className="mt-2" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <h5 className="mb-3">Current Group Members</h5>
        <ListGroup>
          {groupUsers.map((user) => (
            <ListGroupItem
              key={user.userId}
              className="d-flex justify-content-between align-items-center"
            >
              {/* Use `user.username` instead of `user.name` */}
              {user.username || user.userId}
              {user.userId !== currentUser.id && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveUser(user)}
                >
                  <BsXLg />
                </Button>
              )}
            </ListGroupItem>
          ))}
        </ListGroup>

        <h5 className="mb-3 mt-4">Add New Members</h5>
        <ListGroup>
          {searchResults.map((user) => (
            <ListGroupItem
              key={user._id}
              className="d-flex justify-content-between align-items-center"
            >
              {user.username}
              <Button
                variant="success"
                size="sm"
                onClick={() => handleAddUser(user)}
              >
                <BsPlusLg />
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default GroupManagementModal;