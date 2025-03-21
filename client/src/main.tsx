import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for the project
const style = document.createElement('style');
style.textContent = `
  body {
    font-family: 'Roboto', sans-serif;
    color: #333;
    background-color: #f5f5f5;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
  }
  
  .material-icons {
    vertical-align: middle;
  }
  
  /* Animation for modal */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal {
    animation: fadeIn 0.3s ease-out;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Cart badge */
  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: hsl(var(--secondary));
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
`;

document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
