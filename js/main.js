import { render } from "./core/render.js";
import { Layout } from "./layout.js";
import { Home } from "./components/Home.js";

const root = document.querySelector("#app");


// Render Layout with Header and Home inside <main>
render(() => Layout({ children: [Home()] }), root);
