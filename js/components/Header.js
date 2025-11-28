export function Header() {
  const el = document.querySelector("header");
  el.className = "header-content";

  el.innerHTML = `
    <h1>Mikko Tirronen</h1>
    <p>Junior Software Engineer</p>
  `;

  return el;
}
