class Calculator {
  constructor(expressionEl, resultEl) {
    this.expressionEl = expressionEl;
    this.resultEl = resultEl;
    this.reset();
  }

  reset() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = null;
    this.updateDisplay();
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = `${this.currentOperand}${number}`;
    this.updateDisplay();
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    this.updateDisplay();
  }

  applyPercentage() {
    if (!this.currentOperand) return;
    const value = parseFloat(this.currentOperand);
    if (Number.isNaN(value)) return;
    this.currentOperand = (value / 100).toString();
    this.updateDisplay();
  }

  selectOperation(operation) {
    if (!this.currentOperand) return;
    if (this.previousOperand) {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
    this.updateDisplay();
  }

  compute() {
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (Number.isNaN(prev) || Number.isNaN(current)) return;
    let computation;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = current === 0 ? Infinity : prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation.toString();
    this.operation = null;
    this.previousOperand = '';
  }

  evaluate() {
    if (!this.operation || !this.currentOperand || !this.previousOperand) return;
    this.compute();
    this.updateDisplay();
  }

  updateDisplay() {
    this.resultEl.textContent = this.currentOperand || '0';
    if (this.operation && this.previousOperand) {
      this.expressionEl.textContent = `${this.previousOperand} ${this.operation}`;
    } else {
      this.expressionEl.textContent = this.previousOperand || '';
    }
  }
}

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const calculator = new Calculator(expressionEl, resultEl);

const buttons = document.querySelectorAll('[data-action]');
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    switch (action) {
      case 'digit':
        calculator.appendNumber(value);
        break;
      case 'operator':
        calculator.selectOperation(value);
        break;
      case 'equals':
        calculator.evaluate();
        break;
      case 'percent':
        calculator.applyPercentage();
        break;
      case 'delete':
        calculator.delete();
        break;
      case 'clear':
        calculator.reset();
        break;
      default:
        break;
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (['Enter', '='].includes(key)) {
    calculator.evaluate();
    event.preventDefault();
    return;
  }

  if (key === 'Backspace') {
    calculator.delete();
    event.preventDefault();
    return;
  }

  if (key === 'Escape') {
    calculator.reset();
    return;
  }

  if (key === '%') {
    calculator.applyPercentage();
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    calculator.selectOperation(key);
    return;
  }

  if (key === '.') {
    calculator.appendNumber('.');
    return;
  }

  if (key >= '0' && key <= '9') {
    calculator.appendNumber(key);
    return;
  }
});
