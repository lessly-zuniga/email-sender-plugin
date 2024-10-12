import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function ProjectIdForm() {
  const [projectId, setProjectId] = useState("");

  const handleProjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectId(e.target.value);
  };

  const saveProjectId = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          projectId: projectId,
        });
        console.log("Project ID saved successfully");
      } catch (error) {
        console.error("Error saving Project ID:", error);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={projectId}
        onChange={handleProjectIdChange}
        placeholder="Enter Project ID"
      />
      <button onClick={saveProjectId}>Save Project ID</button>
    </div>
  );
}
