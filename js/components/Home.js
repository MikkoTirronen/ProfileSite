export function Home() {
  const section = document.createElement("section");
  section.className = "home";

  section.innerHTML = `
    <h2>Welcome</h2>
    <p>This is my portfolio website. Here you can see my projects and experience.</p>
  `;

  return section;
}
