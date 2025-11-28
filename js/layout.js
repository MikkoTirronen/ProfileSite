import { Header } from "./components/Header.js";

export function Layout({ children = [] }) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-wrapper";

  const mainEl = document.createElement("main");
  mainEl.className = "site-main";

  const footerEl = document.createElement("footer");
  footerEl.className = "site-footer";
  footerEl.textContent = "© 2025 Mikko Tirronen";

  children.forEach((child) => mainEl.appendChild(child));

  wrapper.append(Header(), mainEl, footerEl);
  return wrapper;
}
