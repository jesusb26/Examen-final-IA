import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SidebarLayout.css";
import type { ReactNode } from "react";

interface SidebarLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { path: "/", label: "Subir Archivo", icon: "📂" },
    { path: "/resumen", label: "Resumen", icon: "📝" },
    { path: "/flashcards", label: "Flashcards", icon: "⚡" },
    { path: "/examen", label: "Examen", icon: "🎓" },
  ];

  return (
    <div className="layout-wrapper">
      {/* Barra Lateral */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo-text">{collapsed ? "EA" : "EstudioIA"}</h2>
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "➜" : "⬅"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && <p>© 2024 Mi App</p>}
        </div>
      </aside>

      {/* Contenido de la página */}
      <main className="main-content">{children}</main>
    </div>
  );
}
