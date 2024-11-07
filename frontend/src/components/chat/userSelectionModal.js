import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const modalStyles = {
  header: {
    backgroundColor: "#2C3E50", // Dark theme color
    color: "#ECF0F1", // Light text color
  },
  title: {
    color: "#ECF0F1",
  },
  body: {
    backgroundColor: "#34495E", // Darker background color
    color: "#ECF0F1",
  },
  formControl: {
    backgroundColor: "#ECF0F1", // Light background for input
    color: "#2C3E50",
  },
  buttonPrimary: {
    backgroundColor: "#27AE60", // GeoConnect primary color
    borderColor: "#27AE60",
  },
  buttonSecondary: {
    backgroundColor: "#95A5A6",
    borderColor: "#95A5A6",
  },
};

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
}) => (
  <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
    <Modal.Header closeButton style={modalStyles.header}>
      <Modal.Title style={modalStyles.title}>
        {chatMode === "group" ? "Create Group Chat" : "Start New Chat"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={modalStyles.body}>
      {chatMode === "group" && (
        <Form.Group className="mb-3">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={modalStyles.formControl}
          />
        </Form.Group>
      )}
      
      <Form.Group className="mb-3">
        <Form.Label>Search Users</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch();
            }}
            style={modalStyles.formControl}
          />
        </div>
      </Form.Group>

      {selectedUsers.length > 0 && (
        <div className="selected-users mb-3">
          <strong>Selected Users:</strong>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {selectedUsers.map((user) => (
              <span key={user._id} className="badge bg-primary">
                {user.username}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  onClick={() => handleUserSelect(user)}
                />
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="search-results">
        {searchResults.map((user) => (
          <div
            key={user._id}
            className="search-result-item"
            onClick={() => handleUserSelect(user)}
          >
            <span>{user.username}</span>
            <Form.Check
              type="checkbox"
              checked={selectedUsers.some((selected) => selected._id === user._id)}
              onChange={() => {}}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ))}
      </div>
    </Modal.Body>
    <Modal.Footer style={modalStyles.body}>
      <Button variant="secondary" onClick={() => setShowUserModal(false)} style={modalStyles.buttonSecondary}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleCreateChat}
        style={modalStyles.buttonPrimary}
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

export default UserSelectionModal;
