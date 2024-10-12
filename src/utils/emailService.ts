import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const saveConfig = async (config: { provider: string; apiKey: string }, projectId: string) => {
  try {
    const projectDocRef = doc(db, "users", projectId);
    await updateDoc(projectDocRef, config);
    console.log("Configuración guardada en Firebase");
  } catch (error) {
    console.error("Error al guardar la configuración:", error);
  }
};

export const loadConfig = async (projectId: string) => {
  try {
    const projectDoc = await getDoc(doc(db, "users", projectId));
    if (projectDoc.exists()) {
      return projectDoc.data();
    } else {
      console.log("No hay configuración guardada para este proyecto");
      return null;
    }
  } catch (error) {
    console.error("Error al cargar la configuración:", error);
    return null;
  }
};
