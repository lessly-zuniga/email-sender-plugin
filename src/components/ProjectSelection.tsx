import { useState, useEffect } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import '../App.css'

interface ProjectSelectionProps {
  onSelectProject: (projectId: string) => void;
  userId?: string;
}

export function ProjectSelection({ onSelectProject, userId }: ProjectSelectionProps) {
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    if (!userId) return;
    try {
      const projectsCollection = collection(db, "users", userId, "projects");
      const projectSnapshot = await getDocs(projectsCollection);
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name as string,
      }));
      setProjects(projectList);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error al cargar proyectos: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    loadProjects();
  }, [userId]);

  const handleAddProject = async () => {
    if (!newProjectName) {
      alert("Por favor ingresa un nombre de proyecto.");
      return;
    }

    try {
      if (!userId) return;
      const projectsCollection = collection(db, "users", userId, "projects");
      const projectDoc = await addDoc(projectsCollection, { name: newProjectName });
      onSelectProject(projectDoc.id);
      loadProjects();
      setNewProjectName("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Error al agregar el proyecto: ${error.message}`);
      }
    }
  };

  const handleSelectProject = (projectId: string) => {
    onSelectProject(projectId);
  };

  return (
    <div className="project-selection">
      <h3>Selecciona un Proyecto</h3>
      {projects.length > 0 ? (
        <ul className="project-list">
          {projects.map((project) => (
            <li
              key={project.id}
              onClick={() => handleSelectProject(project.id)}
              className="project-item"
            >
              {project.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes proyectos. Agrega uno nuevo.</p>
      )}

      <h4>Agregar Nuevo Proyecto</h4>
      <input
        type="text"
        placeholder="Nombre del proyecto"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        className="form-input"
      />
      <button className="form-button" onClick={handleAddProject}>
        Agregar Proyecto
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
