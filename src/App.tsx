import { EmailSettings } from "./components/EmailSettings";
import "./App.css";
import { framer } from "framer-plugin";

export function App() {
    framer.showUI({
        position: "top right",
        width: 450,
        height: 450,
    })

  return (
    <main>
      <div className="framer-container">
        <EmailSettings />
      </div>
    </main>
  );
}
