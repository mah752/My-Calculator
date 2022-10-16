// calculator object created below which contains the items we need to construct a valid expression
const calculator = {
    //we keep track of what should be displayed on the screen with the display value which contains a string.
    displayValue: "0",
    //will store the first inputed information called operand. This is set to null
    firstOperand: null,
    //checks if both the first operand and the operator have been inputted. If true then the second numbers that the user inputs is the second operand.
    waitingForSecondOperand: false,
    //will store the inputted operator e.g "+". This is also set to null
    operator: null,
};

//in order to show the contends of the screen at all times we will have a update display function. This is at the bottom as JS reads top to bottom.
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue =
            displayValue === "0" ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = "0.";
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === "+") {
        return firstOperand + secondOperand;
    } else if (operator === "-") {
        return firstOperand - secondOperand;
    } else if (operator === "*") {
        return firstOperand * secondOperand;
    } else if (operator === "/") {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = "0";
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

//If you look at the HTML code for the app, you’ll see that the “screen” is really just a disabled text input:
//since we cant type directly into the the text box, we can change value with JS by handling key presses and using event listeners.
function updateDisplay() {
    const display = document.querySelector(".calculator-screen");
    display.value = calculator.displayValue;
}


updateDisplay();

//We have four sets of keys on the calculator: digits (0-9), operators (+, −, ⨉, ÷, =), a decimal point (.) and a reset key (AC). In this section, we’ll listen for clicks on the calculator keys and determine what type of key was clicked.
// listening for a click event on the element with a class of calculator-keys
// Event delegation used since all the keys on the calculator are children of the calculator keys element.
const keys = document.querySelector(".calculator-keys");
keys.addEventListener("click", (event) => {
    //Inside the callback function of the event listener, we extract the target property of the click event using destructuring assignment which makes it easy to unpack object properties into distinct variables.
    ////we use target variable which is an object which represents the element that was clicked.
    const { target } = event;
    const { value } = target;
    if (!target.matches("button")) {
        return;
    }

    switch (value) {
        case "+":
        case "-":
        case "*":
        case "/":
        case "=":
            handleOperator(value);
            break;
        case ".":
            inputDecimal(value);
            break;
        case "all-clear":
            resetCalculator();
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
});