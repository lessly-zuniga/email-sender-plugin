import { useState, useEffect } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../App.css";

interface EmailSettingsProps {
  projectId: string;
  userId: string;
  onCancel: () => void;
}

export function EmailSettings({
  projectId,
  userId,
  onCancel,
}: EmailSettingsProps) {
  const [provider, setProvider] = useState<"SendGrid" | "Mailgun" | "Resent">(
    "SendGrid"
  );
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const projectRef = doc(db, "users", userId, "projects", projectId);
        const projectSnap = await getDoc(projectRef);
        if (projectSnap.exists()) {
          const projectData = projectSnap.data();
          setProvider(projectData.provider || "SendGrid");
          setApiKey(projectData.apiKey || "");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error al cargar la configuración: ${err.message}`);
        }
      }
    };
    loadConfig();
  }, [projectId, userId]);

  const handleSaveConfig = async () => {
    if (!apiKey) {
      alert("Por favor, ingresa una API Key válida.");
      return;
    }

    setLoading(true);
    try {
      const projectRef = doc(db, "users", userId, "projects", projectId);
      await updateDoc(projectRef, { provider, apiKey });
      alert("Configuración guardada con éxito.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error al guardar la configuración: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plugin-container">
      <div className="go-back" onClick={onCancel}>
        ←
      </div>
      <h3>Configuración del Proveedor de Correo</h3>
      {error && <p className="error-message">{error}</p>}
      <div className="form-section">
        <label className="form-label">Proveedor de Correo:</label>
        <select
          value={provider}
          onChange={(e) =>
            setProvider(e.target.value as "SendGrid" | "Mailgun" | "Resent")
          }
          className="form-select"
        >
          <option value="SendGrid">SendGrid</option>
          <option value="Mailgun">Mailgun</option>
          <option value="Resent">Resent</option>
        </select>
      </div>
      <div className="form-section">
        <label className="form-label">API Key:</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="form-input"
          placeholder="Ingresa la API Key"
        />
      </div>
      <div className="form-buttons">
        <button
          className="form-button"
          onClick={handleSaveConfig}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button
          className="form-button cancel-button"
          onClick={onCancel}
          style={{ marginLeft: "24px" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
