import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import { ProjectSelection } from "./components/ProjectSelection";
import { EmailSettings } from "./components/EmailSettings";
import { framer } from "framer-plugin";
import './App.css'

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    framer.showUI({
      position: "top right",
      width: 450,
      height: 600,
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setStep(1); 
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => setStep(1);
  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    setStep(2); 
  };
  const handleCancel = () => setStep(1); 

  return (
    <main>
      <div className="framer-container">
        {step === 0 && <Login onSuccess={handleLoginSuccess} />}
        {step === 1 && user && (
          <ProjectSelection onSelectProject={handleSelectProject} userId={user.uid} />
        )}
        {step === 2 && user && selectedProject && (
          <EmailSettings 
            projectId={selectedProject} 
            userId={user.uid}
            onCancel={handleCancel} 
          />
        )}
      </div>
    </main>
  );
}
