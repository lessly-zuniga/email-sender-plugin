import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const saveConfig = async (config: { provider: string; apiKey: string }) => {
  try {
    await setDoc(doc(db, "emailConfig", "config"), config);
    console.log("Configuración guardada en Firebase");
  } catch (error) {
    console.error("Error al guardar la configuración:", error);
  }
};

export const loadConfig = async () => {
  try {
    const configDoc = await getDoc(doc(db, "emailConfig", "config"));
    if (configDoc.exists()) {
      return configDoc.data();
    } else {
      console.log("No hay configuración guardada");
      return null;
    }
  } catch (error) {
    console.error("Error al cargar la configuración:", error);
    return null;
  }
};
