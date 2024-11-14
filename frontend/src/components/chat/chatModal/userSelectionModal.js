import React, { useEffect } from "react";
import { Modal, Form, Button, ListGroup } from "react-bootstrap";
import { BsSearch, BsPeople, BsPersonPlus, BsXLg } from "react-icons/bs";
import "./userSelectionModal.css";

const UserSelectionModal = ({
  showUserModal,
  setShowUserModal,
  chatMode,
  groupName,
  setGroupName,
  search,
  setSearch,
  searchResults,
  selectedUsers,
  handleSearch,
  handleUserSelect,
  handleCreateChat,
}) => {
  // Add debounced search effect
  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (search.trim()) {
        handleSearch();
      }
    }, 300); // 300ms delay

    return () => clearTimeout(debounceSearch);
  }, [search, handleSearch]);

  return (
    <Modal 
      show={showUserModal} 
      onHide={() => setShowUserModal(false)} 
      centered
      className="user-selection-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold">
          <BsPeople className="me-2 mb-1" />
          {chatMode === "group" ? "Create Group Chat" : "Start New Chat"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        {chatMode === "group" && (
          <Form.Group className="mb-4">
            <Form.Label className="section-title">
              <BsPeople className="me-2 mb-1" />
              Group Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="group-name-input"
            />
          </Form.Group>
        )}

        <div className="search-container mb-4">
          <Form.Label className="section-title">
            <BsSearch className="me-2 mb-1" />
            Search Users
          </Form.Label>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Start typing to search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <BsSearch className="search-icon" />
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="section-container mb-4">
            <h5 className="section-title">
              <BsPersonPlus className="me-2 mb-1" />
              Selected Users ({selectedUsers.length})
            </h5>
            <ListGroup className="custom-list-group">
              {selectedUsers.map((user) => (
                <ListGroup.Item key={user._id} className="custom-list-item">
                  <div className="user-avatar">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="user-name">{user.username}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    className="remove-button"
                    onClick={() => handleUserSelect(user)}
                  >
                    <BsXLg />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="section-container">
            <h5 className="section-title">
              <BsSearch className="me-2 mb-1" />
              Search Results ({searchResults.length})
            </h5>
            <ListGroup className="custom-list-group">
              {searchResults.map((user) => (
                <ListGroup.Item
                  key={user._id}
                  className="custom-list-item search-result-item"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="item-content">
                    <div className="user-avatar">
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="user-name">{user.username}</span>
                  </div>
                  <Form.Check
                    type="checkbox"
                    className="user-checkbox"
                    checked={selectedUsers.some(
                      (selected) => selected._id === user._id
                    )}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 px-4 pb-4">
        <Button
          variant="secondary"
          onClick={() => setShowUserModal(false)}
          className="cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCreateChat}
          className="create-button"
          disabled={
            selectedUsers.length === 0 ||
            (chatMode === "group" && (!groupName.trim() || selectedUsers.length < 2))
          }
        >
          {chatMode === "group" ? "Create Group" : "Start Chat"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSelectionModal;