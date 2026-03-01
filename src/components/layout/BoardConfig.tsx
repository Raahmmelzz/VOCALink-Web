import React, { useState, useRef, useEffect } from 'react';
import "../../styles/DashboardComponent.css";
import "../../styles/DashboardLayout.css";

interface Board {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
}

const BoardConfig: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([
    { id: 1, name: 'Food', status: 'Active' },
    { id: 2, name: 'Emotions', status: 'Inactive' },
  ]);
  const [newBoardName, setNewBoardName] = useState<string>('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddBoard = () => {
    const trimmed = newBoardName.trim();
    if (!trimmed) return;
    setBoards(prev => [...prev, { id: Date.now(), name: trimmed, status: 'Active' }]);
    setNewBoardName('');
  };

  const handleRemove = (id: number) => {
    setBoards(prev => prev.filter(b => b.id !== id));
    setOpenMenuId(null);
  };

  const handleToggleStatus = (id: number) => {
    setBoards(prev =>
      prev.map(b =>
        b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b
      )
    );
    setOpenMenuId(null);
  };

  const handleStartEdit = (board: Board) => {
    setEditingId(board.id);
    setEditingName(board.name);
    setOpenMenuId(null);
  };

  const handleSaveEdit = (id: number) => {
    const trimmed = editingName.trim();
    if (!trimmed) return;
    setBoards(prev => prev.map(b => (b.id === id ? { ...b, name: trimmed } : b)));
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id?: number) => {
    if (e.key === 'Enter') {
      if (id !== undefined) handleSaveEdit(id);
      else handleAddBoard();
    }
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div className="board-container">
      <h2 className="page-title">VocalInk Board Manager</h2>

      {/* Add Board Row */}
      <div className="input-group">
        <input
          type="text"
          value={newBoardName}
          onChange={e => setNewBoardName(e.target.value)}
          onKeyDown={e => handleKeyDown(e)}
          placeholder="New Board Name..."
          className="student-input"
        />
        <button onClick={handleAddBoard} className="btn-primary">
          Add Board
        </button>
      </div>

      {/* Board List */}
      <ul className="student-list" style={{ marginTop: '20px' }}>
        {boards.map(board => (
          <li
            key={board.id}
            className="student-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Board Name or Edit Input */}
            {editingId === board.id ? (
              <input
                autoFocus
                value={editingName}
                onChange={e => setEditingName(e.target.value)}
                onKeyDown={e => handleKeyDown(e, board.id)}
                onBlur={() => handleSaveEdit(board.id)}
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  border: '1px solid #2aa7ff',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  outline: 'none',
                  color: '#1a2e40',
                  flex: 1,
                  marginRight: '12px',
                }}
              />
            ) : (
              <span>
                {board.name}{' '}
                <span style={{ color: '#888', fontWeight: 400 }}>
                  ({board.status})
                </span>
              </span>
            )}

            {/* Options Button + Dropdown */}
            <div
              style={{ position: 'relative' }}
              ref={openMenuId === board.id ? menuRef : null}
            >
              <button
                onClick={() =>
                  setOpenMenuId(openMenuId === board.id ? null : board.id)
                }
                title="Options"
                style={{
                  background: 'none',
                  border: '1px solid #d0dce8',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#555',
                  lineHeight: 1,
                }}
              >
                ⋯
              </button>

              {openMenuId === board.id && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 6px)',
                    backgroundColor: '#fff',
                    border: '1px solid #dde6ef',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                    zIndex: 100,
                    minWidth: '170px',
                    overflow: 'hidden',
                  }}
                >
                  {[
                    {
                      label: '✏️  Edit Name',
                      onClick: () => handleStartEdit(board),
                      danger: false,
                    },
                    {
                      label:
                        board.status === 'Active'
                          ? '🔕  Set Inactive'
                          : '✅  Set Active',
                      onClick: () => handleToggleStatus(board.id),
                      danger: false,
                    },
                    {
                      label: '🗑️  Remove Board',
                      onClick: () => handleRemove(board.id),
                      danger: true,
                    },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        color: item.danger ? '#e53e3e' : '#1a2e40',
                        fontWeight: 500,
                      }}
                      onMouseEnter={e =>
                        ((e.target as HTMLButtonElement).style.backgroundColor =
                          item.danger ? '#fff5f5' : '#f0f7ff')
                      }
                      onMouseLeave={e =>
                        ((e.target as HTMLButtonElement).style.backgroundColor =
                          'transparent')
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardConfig;