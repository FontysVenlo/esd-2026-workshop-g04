import { add } from "./calculator.js";

const form = document.querySelector("#calculator-form");
const firstInput = document.querySelector("#first-number");
const secondInput = document.querySelector("#second-number");
const result = document.querySelector("#result");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const first = firstInput.valueAsNumber;
  const second = secondInput.valueAsNumber;

  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    result.textContent = "Enter two valid numbers.";
    return;
  }

  result.textContent = `Result: ${add(first, second)}`;
});