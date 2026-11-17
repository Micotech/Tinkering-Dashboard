
const wheel = document.getElementById("test-wheel");
const rotateButton = document.getElementById("rotate-button");
const result = document.getElementById("rotation-result");

let rotation = 0;

rotateButton.addEventListener("click", () => {
  rotation += 360;

  wheel.style.transition = "transform 1s ease";
  wheel.style.transform = `rotate(${rotation}deg)`;

  result.textContent = "SVG rotation executed successfully.";
});
