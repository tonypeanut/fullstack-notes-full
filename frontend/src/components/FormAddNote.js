import React, { useState } from "react";

const FormAddNote = ({ onAddNote, categories }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    // Call the parent function to handle adding a new note
    await onAddNote({
      title,
      content,
    }, selectedCategories);

    // Clear the form after successful submission
    setTitle("");
    setContent("");
    setSelectedCategories([]);
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((category) => category !== value)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-100 rounded">
      <h2 className="text-lg font-bold mb-2">Add a New Note</h2>
      <div className="mb-2">
        <label className="block text-sm">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter note title"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter note content (optional)"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Categories:</label>
        <div className="flex flex-wrap gap-4 mt-2">
            {categories.map((category) => (
            <div key={category.id} className="flex items-center">
                <input
                type="checkbox"
                id={`category-${category.id}`}
                value={category.name}
                checked={selectedCategories.includes(category.name)}
                onChange={handleCategoryChange}
                className="form-checkbox"
                />
                <label htmlFor={`category-${category.id}`} className="ml-2">
                {category.name}
                </label>
            </div>
            ))}
        </div>
        </div>

      <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
        Add Note
      </button>
    </form>
  );
};

export default FormAddNote;
