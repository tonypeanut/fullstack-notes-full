import React, { useState } from "react";
import { FaArchive, FaTrash, FaPlus, FaEdit, FaSave } from "react-icons/fa";

const NoteCard = ({ note, onToggleArchive, onDelete, onToggleCategory, onEditNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleSave = async () => {
    const updatedData = { title: editedTitle, content: editedContent };
    await onEditNote(note.id, updatedData);
    setIsEditing(false);
  };

  const handleAddCategory = () => {
    const categoryName = prompt("Enter category name:");
    if (categoryName) {
      onToggleCategory(note.id, categoryName, true);
    }
  };

  const handleRemoveCategory = (categoryName) => {
    onToggleCategory(note.id, categoryName, false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-50">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded-lg text-lg font-bold"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded-lg text-gray-700"
            rows="3"
          ></textarea>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold">{note.title}</h3>
          <p className="text-gray-700">{note.content}</p>
        </div>
      )}

      <div className="mt-2">
        <h4 className="text-sm font-semibold text-gray-600">Categories:</h4>
        {note.categories && note.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {note.categories.map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs flex items-center gap-1"
              >
                {category.name}
                <button
                  onClick={() => handleRemoveCategory(category.name)}
                  className="text-red-600 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No categories</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="p-2 bg-green-500 text-white rounded-lg flex items-center justify-center"
            title="Save"
          >
            <FaSave />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-blue-500 text-white rounded-lg flex items-center justify-center"
            title="Edit"
          >
            <FaEdit />
          </button>
        )}
        <button
          onClick={() => onToggleArchive(note.id, note.is_archived)}
          className="p-2 bg-yellow-500 text-white rounded-lg flex items-center justify-center"
          title={note.is_archived ? "Unarchive" : "Archive"}
        >
          <FaArchive />
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-2 bg-red-500 text-white rounded-lg flex items-center justify-center"
          title="Delete"
        >
          <FaTrash />
        </button>
        <button
          onClick={handleAddCategory}
          className="p-2 bg-blue-500 text-white rounded-lg flex items-center justify-center"
          title="Add Category"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
