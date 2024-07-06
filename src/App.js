// src/App.js
import React, { useState } from 'react';
import initialFolders from './Folder';

function App() {
  const [folders, setFolders] = useState(initialFolders);
  const [currentPath, setCurrentPath] = useState(['Root']);
  const [currentFolder, setCurrentFolder] = useState(folders[0]);
  const [newItemName, setNewItemName] = useState('');
  const [renameId, setRenameId] = useState(null);
  const [renameName, setRenameName] = useState('');
  const [showFileInput, setShowFileInput] = useState(false);
  const [showFolderInput, setShowFolderInput] = useState(false);

  const findFolder = (path, folders) => {
    let folder = folders[0];
    for (let name of path.slice(1)) {
      folder = folder.contents.find((f) => f.name === name);
    }
    return folder;
  };

  const updateFolder = (path, updatedFolder, folders) => {
    if (path.length === 1) {
      folders[0] = updatedFolder;
    } else {
      let parentFolder = findFolder(path.slice(0, -1), folders);
      parentFolder.contents = parentFolder.contents.map((item) =>
        item.name === updatedFolder.name ? updatedFolder : item
      );
    }
    return [...folders];
  };

  const handleFolderClick = (folder) => {
    setCurrentPath([...currentPath, folder.name]);
    setCurrentFolder(folder);
  };

  const handleBackClick = () => {
    const newPath = currentPath.slice(0, -1);
    setCurrentPath(newPath);
    setCurrentFolder(findFolder(newPath, folders));
  };

  const handleCreateItem = (isFolder) => {
    if (!newItemName || newItemName.trim() === "") {
      setShowFileInput(false);
      setShowFolderInput(false);
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      isFolder: isFolder,
      contents: isFolder ? [] : undefined,
    };

    currentFolder.contents.push(newItem);
    const updatedFolders = updateFolder(currentPath, currentFolder, folders);
    setFolders(updatedFolders);
    setCurrentFolder({ ...currentFolder });
    setNewItemName('');
    setShowFileInput(false);
    setShowFolderInput(false);
  };

  const handleDeleteItem = (itemId) => {
    const updatedContents = currentFolder.contents.filter((item) => item.id !== itemId);
    const updatedFolder = { ...currentFolder, contents: updatedContents };
    const updatedFolders = updateFolder(currentPath, updatedFolder, folders);
    setFolders(updatedFolders);
    setCurrentFolder(updatedFolder);
  };

  const handleRenameItem = (itemId) => {
    if (renameName === "") {
      setRenameId(null);
      return;
    }
    const updatedContents = currentFolder.contents.map((item) => {
      if (item.id === itemId) {
        item.name = renameName;
      }
      return item;
    });
    const updatedFolder = { ...currentFolder, contents: updatedContents };
    const updatedFolders = updateFolder(currentPath, updatedFolder, folders);
    setFolders(updatedFolders);
    setCurrentFolder(updatedFolder);
    setRenameId(null);
    setRenameName('');
  };

  return (
    <div className='w-full flex justify-center flex-col items-center gap-9'>
      <h3 className='text-xl md:text-3xl'>File Manager</h3>
      <div className='manager border-2 relative border-sky-500 w-full md:max-w-3/4 h-[70vh] rounded-md px-6 py-4 flex flex-col'>
        <div className='flex justify-between items-center mb-4'>
          <button onClick={handleBackClick} disabled={currentPath.length <= 1} className='border p-2 rounded hover:bg-slate-400 hover:text-white'>
            Back
          </button>
          <span className='text-lg md:text-xl'>{currentPath.join(' / ')}</span>
        </div>
        <div className='flex flex-wrap gap-5'>
          {currentFolder.contents.map((item) => (
            <div
              key={item.id}
              className='flex flex-col justify-center items-center gap-2 mb-5 w-full md:w-[15ch] cursor-pointer relative'
            >
              <span
                className='text-5xl cursor-pointer'
                onClick={() => item.isFolder && handleFolderClick(item)}
              >
                {item.isFolder ? '📁' : '📄'}
              </span>
              {renameId === item.id ? (
                <>
                  <input
                    type='text'
                    value={renameName}
                    autoFocus
                    onChange={(e) => setRenameName(e.target.value)}
                    onBlur={() => handleRenameItem(item.id)}
                    className='border p-2 rounded w-full md:w-3/4 outline-none'
                  />
                </>
              ) : (
                <>
                  <span className='flex flex-row gap-1 w-full justify-center items-center'>
                    <button
                      onClick={() => setRenameId(item.id)}
                      className='text-blue-500'
                    >✎</button>
                    <span className='truncate max-w-[10ch]'>{item.name}</span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className='text-red-500'
                    >✕</button>
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className='flex gap-2 mt-4'>
          {showFileInput || showFolderInput ? (
            <div className='flex gap-2 absolute top-0 left-1/2 transform -translate-x-1/2'>
              <input
                type='text'
                placeholder='New item name'
                autoFocus
                onBlur={() => handleCreateItem(showFolderInput)}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className='border p-2 rounded w-full outline-none'
              />
            </div>
          ) : (
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-2'>
              <button
                onClick={() => {
                  setShowFileInput(true);
                  setShowFolderInput(false);
                }}
                className='border p-2 rounded hover:bg-slate-400 hover:text-white transition'
              >
                New File
              </button>
              <button
                onClick={() => {
                  setShowFolderInput(true);
                  setShowFileInput(false);
                }}
                className='border p-2 rounded hover:bg-slate-400 hover:text-white transition'
              >
                New Folder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
