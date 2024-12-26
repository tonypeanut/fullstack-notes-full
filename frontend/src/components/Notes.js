import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { jwtDecode } from "jwt-decode";
import FormAddNote from "./FormAddNote";
import NoteCard from "./NoteCard";

const Notes = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (isTokenExpired) {
          logout();
          navigate("/login");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
        navigate("/login");
      }
    }
  }, [token, logout, navigate]);

  // Fetch notes and categories
  useEffect(() => {
    fetchNotesAndCategories();
  }, [token]);

  const fetchNotesAndCategories = async () => {
    setLoading(true);
    try {
      const notesResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const notesData = await notesResponse.json();

      const archivedResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/archived`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const archivedData = await archivedResponse.json();

      const categoriesResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categoriesData = await categoriesResponse.json();

      setNotes(notesData);
      setArchivedNotes(archivedData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching notes and categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleArchive = async (noteId, isArchived) => {
    const endpoint = isArchived ? `/notes/${noteId}/unarchive` : `/notes/${noteId}/archive`;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedNote = await response.json();
        if (isArchived) {
          setArchivedNotes((prev) => prev.filter((note) => note.id !== updatedNote.id));
          setNotes((prev) => [...prev, updatedNote]);
        } else {
          setNotes((prev) => prev.filter((note) => note.id !== updatedNote.id));
          setArchivedNotes((prev) => [...prev, updatedNote]);
        }
      }
    } catch (error) {
      console.error("Error toggling archive:", error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
        setArchivedNotes(prev => prev.filter(note => note.id !== noteId));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const toggleCategory = async (noteId, categoryName, add) => {
    try {
      const method = add ? "POST" : "DELETE";
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/${noteId}/categories`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ category_name: categoryName }),
      });
  
      if (response.ok) {
        const updatedNote = await response.json();
        
        if (!updatedNote.is_archived) {
          setNotes((prev) =>
            prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
          );
        } else {
          setArchivedNotes((prev) =>
            prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
          );
        }
      }
  
      const categoriesResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/categories`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
      
    } catch (error) {
      console.error("Error toggling category:", error);
    }
  };

  const filterNotesByCategory = async (categoryName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/category/${categoryName}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const filteredNotes = await response.json();
  
        const activeNotes = filteredNotes.filter(note => !note.is_archived);
        const archivedNotes = filteredNotes.filter(note => note.is_archived);
  
        setNotes(activeNotes);
        setArchivedNotes(archivedNotes);
      }
    } catch (error) {
      console.error("Error filtering notes by category:", error);
    }
  };

  const addNote = async (noteData, selectedCategories = []) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });
  
      if (response.ok) {
        const newNote = await response.json();
        console.log(newNote)
        console.log(selectedCategories)
        // Añadir las categorías seleccionadas a la nota recién creada
        for (const categoryName of selectedCategories) {
          toggleCategory(newNote.id, categoryName, true);
        }
  
        // Actualizar las notas después de añadir las categorías
        setNotes((prev) => [...prev, newNote]);
      } else {
        console.error("Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const editNote = async (noteId, updatedData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/${noteId}`, {
        method: "PUT", // o PATCH si la actualización es parcial
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const updatedNote = await response.json();
  
        if (updatedNote.is_archived) {
          setArchivedNotes((prev) =>
            prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
          );
        } else {
          setNotes((prev) =>
            prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
          );
        }
      } else {
        console.error("Failed to update note");
      }
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  return (
    <div className="bg-blue-100 min-h-screen">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4">Your Notes</h1>
        <FormAddNote onAddNote={addNote} categories={categories} />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category:</label>
          <select
            value={selectedCategory || ""}
            onChange={(e) => {
              const categoryName = e.target.value;
              setSelectedCategory(categoryName);
              if (categoryName) {
                filterNotesByCategory(categoryName);
              } else {
                // Restablecer todas las notas
                setNotes([]);
                setArchivedNotes([]);
                fetchNotesAndCategories(); // Vuelve a cargar todas las notas y categorías
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-green-600 mb-4">Active Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onToggleArchive={toggleArchive}
                      onDelete={deleteNote}
                      onToggleCategory={toggleCategory}
                      onEditNote={editNote}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Archived Notes</h2>
                <button
                  onClick={() => setShowArchived((prev) => !prev)}
                  className="mb-4 p-2 bg-blue-500 text-white rounded"
                >
                  {showArchived ? "Hide Archived Notes" : "Show Archived Notes"}
                </button>
                {showArchived && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archivedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onToggleArchive={toggleArchive}
                        onDelete={deleteNote}
                        onToggleCategory={toggleCategory}
                        onEditNote={editNote}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <button onClick={() => logout()} className="mt-4 p-2 bg-red-500 text-white rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Notes;
