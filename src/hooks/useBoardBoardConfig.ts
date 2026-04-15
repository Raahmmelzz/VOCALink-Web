import { useState, useRef, useEffect } from 'react';

export interface Board {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
}

export const useBoardConfig = () => {
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

  // Return everything the component needs to render
  return {
    boards,
    newBoardName,
    setNewBoardName,
    openMenuId,
    setOpenMenuId,
    editingId,
    editingName,
    setEditingName,
    menuRef,
    handleAddBoard,
    handleRemove,
    handleToggleStatus,
    handleStartEdit,
    handleSaveEdit,
    handleKeyDown
  };
};