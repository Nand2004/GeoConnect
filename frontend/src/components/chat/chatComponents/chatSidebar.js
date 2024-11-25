import React from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { BsPlus, BsPeople, BsTrash } from 'react-icons/bs';
import { MdOutlineGroup } from 'react-icons/md';

function ChatSidebar({
  chatHistory,
  currentUser,
  chatId,
  handleChatSelect,
  handleDeleteChat,
  setChatMode,
  setShowUserModal,
  setSelectedUsers,
  setSearch,
  unreadCounts,
  error,
  successMessage
}) {
  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column h-100">
        <div className="mb-3 d-flex gap-2">
          <Button
            variant="primary"
            className="w-50 d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              setChatMode("direct");
              setShowUserModal(true);
              setSelectedUsers([]);
              setSearch("");
            }}
          >
            <BsPlus size={20} />
            New Chat
          </Button>
          <Button
            variant="outline-primary"
            className="w-50 d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              setChatMode("group");
              setShowUserModal(true);
              setSelectedUsers([]);
              setSearch("");
            }}
          >
            <BsPeople size={20} />
            New Group
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <div className="overflow-auto flex-grow-1">
          {chatHistory.slice().reverse().map((chat) => (
            <Card
              key={chat._id}
              className={`mb-2 cursor-pointer ${chatId === chat._id ? 'border-primary' : ''}`}
              onClick={() => handleChatSelect(chat)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body className="d-flex justify-content-between align-items-center py-2">
                <div className="d-flex align-items-center gap-2">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-medium">
                        {chat.chatType === "group" ? (
                          <>
                            {chat.chatName}
                            <MdOutlineGroup className="ms-2" />
                          </>
                        ) : (
                          chat.usernames.filter(username => username !== currentUser.username).join(", ")
                        )}
                      </span>
                    </div>
                    {unreadCounts[chat._id] > 0 && (
                      <span className="badge bg-primary">{unreadCounts[chat._id]} new</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="link"
                  className="text-danger p-0"
                  onClick={e => handleDeleteChat(e, chat._id, chat)}
                >
                  <BsTrash size={18} />
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ChatSidebar;