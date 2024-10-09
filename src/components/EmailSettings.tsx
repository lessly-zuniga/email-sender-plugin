import { useState } from "react";
import { saveConfig } from "../utils/emailService";

export function EmailSettings() {
  const [provider, setProvider] = useState<"SendGrid" | "Mailgun" | "Resent">("SendGrid");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveConfig = async () => {
    if (!apiKey) {
      alert("Por favor, ingresa una API Key válida.");
      return;
    }

    setLoading(true);
    try {
      const config = { provider, apiKey };
      await saveConfig(config);
      alert("Configuración guardada con éxito en Firebase.");
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      alert("Hubo un error al guardar la configuración.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Configuración del Proveedor de Correo</h3>
      <label>
        Selecciona el Proveedor:
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as "SendGrid" | "Mailgun" | "Resent")}
        >
          <option value="SendGrid">SendGrid</option>
          <option value="Mailgun">Mailgun</option>
          <option value="Resent">Resent</option>
        </select>
      </label>
      <br />
      <label>
        API Key:
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Ingresa la API Key"
          required
        />
      </label>
      <br />
      <button onClick={handleSaveConfig} disabled={loading}>
        {loading ? "Guardando..." : "Guardar Configuración"}
      </button>
    </div>
  );
}
