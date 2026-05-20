/**
 * Calculator App with Secret Code Feature
 * Secret Code: 556677567
 */

class Calculator {
    constructor() {
        this.display = document.getElementById('result');
        this.currentValue = '';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.secretCode = '556677567';
        this.secretInputBuffer = '';
        this.secretUnlocked = false;
        
        this.init();
    }

    init() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleButtonClick(e));
        });
        this.updateDisplay();
    }

    handleButtonClick(e) {
        const btn = e.target;
        const action = btn.dataset.action;
        const value = btn.dataset.value;

        if (action === 'number') {
            this.handleNumber(value);
        } else if (action === 'operator') {
            this.handleOperator(value);
        } else if (action === 'clear') {
            this.clear();
        } else if (action === 'delete') {
            this.delete();
        }
    }

    handleNumber(num) {
        // Track secret code input
        this.secretInputBuffer += num;
        if (this.secretInputBuffer.length > this.secretCode.length) {
            this.secretInputBuffer = this.secretInputBuffer.slice(1);
        }
        this.checkSecretCode();

        if (this.shouldResetDisplay) {
            this.currentValue = num === '.' ? '0.' : num;
            this.shouldResetDisplay = false;
        } else {
            if (num === '.') {
                if (!this.currentValue.includes('.')) {
                    this.currentValue += num;
                }
            } else {
                this.currentValue += num;
            }
        }
        this.updateDisplay();
    }

    handleOperator(op) {
        if (op === '=') {
            this.calculate();
        } else {
            if (this.currentValue === '' && this.previousValue === '') return;
            
            if (this.currentValue !== '') {
                if (this.previousValue !== '' && this.operation) {
                    this.calculate();
                } else {
                    this.previousValue = this.currentValue;
                }
                this.currentValue = '';
            }
            this.operation = op;
        }
    }

    calculate() {
        if (!this.operation || this.currentValue === '' || this.previousValue === '') {
            return;
        }

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result = 0;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : 0;
                if (current === 0) {
                    this.display.value = 'Error: Division by zero';
                    this.shouldResetDisplay = true;
                    this.currentValue = '';
                    this.previousValue = '';
                    this.operation = null;
                    return;
                }
                break;
        }

        this.currentValue = this.formatResult(result);
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    formatResult(num) {
        // Round to 10 decimal places to avoid floating point errors
        const rounded = Math.round(num * 10000000000) / 10000000000;
        return rounded.toString();
    }

    delete() {
        if (this.shouldResetDisplay) return;
        this.currentValue = this.currentValue.slice(0, -1);
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    checkSecretCode() {
        if (this.secretInputBuffer === this.secretCode) {
            this.unlockSecret();
            this.secretInputBuffer = '';
        }
    }

    unlockSecret() {
        if (!this.secretUnlocked) {
            this.secretUnlocked = true;
            this.display.value = '🎉 SECRET UNLOCKED! 🎉';
            this.display.style.color = '#00ff00';
            
            setTimeout(() => {
                this.display.value = '';
                this.display.style.color = '#00d4ff';
                this.clear();
            }, 2000);
        }
    }

    updateDisplay() {
        this.display.value = this.currentValue || '0';
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});