export function render(component, root) {
  //root.innerHTML = "";
  root.appendChild(component());
}
