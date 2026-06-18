/**
 * Advanced Calculator App with Secret Code Feature
 * Secret Code: 556677567
 * Features: History tracking, advanced functions, keyboard support, local storage
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
        this.history = [];
        this.maxHistoryItems = 50;
        
        this.init();
        this.loadHistory();
        this.setupKeyboardSupport();
        this.setupHistoryModal();
    }

    init() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleButtonClick(e));
        });
        this.updateDisplay();
    }

    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            
            // Number keys
            if (key >= '0' && key <= '9') {
                this.handleNumber(key);
            }
            // Decimal point
            else if (key === '.') {
                this.handleNumber('.');
            }
            // Operators
            else if (key === '+' || key === '-') {
                this.handleOperator(key);
            }
            else if (key === '*') {
                e.preventDefault();
                this.handleOperator('*');
            }
            else if (key === '/') {
                e.preventDefault();
                this.handleOperator('/');
            }
            // Enter or equals
            else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                this.handleOperator('=');
            }
            // Backspace
            else if (key === 'Backspace') {
                e.preventDefault();
                this.delete();
            }
            // Escape - clear
            else if (key === 'Escape') {
                this.clear();
            }
        });
    }

    setupHistoryModal() {
        const historyBtn = document.getElementById('historyBtn');
        const historyModal = document.getElementById('historyModal');
        const closeBtn = document.getElementById('closeBtn');
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');

        historyBtn.addEventListener('click', () => {
            this.displayHistory();
            historyModal.classList.add('show');
        });

        closeBtn.addEventListener('click', () => {
            historyModal.classList.remove('show');
        });

        historyModal.addEventListener('click', (e) => {
            if (e.target === historyModal) {
                historyModal.classList.remove('show');
            }
        });

        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all history?')) {
                this.clearHistory();
                this.displayHistory();
            }
        });
    }

    handleButtonClick(e) {
        const btn = e.target;
        const action = btn.dataset.action;
        const value = btn.dataset.value;

        if (action === 'number') {
            this.handleNumber(value);
        } else if (action === 'operator') {
            this.handleOperator(value);
        } else if (action === 'function') {
            this.handleFunction(value);
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

    handleFunction(func) {
        if (this.currentValue === '') return;

        const current = parseFloat(this.currentValue);
        let result = 0;

        switch (func) {
            case 'sqrt':
                if (current < 0) {
                    this.display.value = 'Error: Negative sqrt';
                    this.shouldResetDisplay = true;
                    this.currentValue = '';
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'square':
                result = current * current;
                break;
            case 'reciprocal':
                if (current === 0) {
                    this.display.value = 'Error: Division by zero';
                    this.shouldResetDisplay = true;
                    this.currentValue = '';
                    return;
                }
                result = 1 / current;
                break;
            case 'percent':
                result = current / 100;
                break;
            case 'toggle':
                result = current * -1;
                break;
            default:
                return;
        }

        this.currentValue = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
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
                if (current === 0) {
                    this.display.value = 'Error: Division by zero';
                    this.shouldResetDisplay = true;
                    this.currentValue = '';
                    this.previousValue = '';
                    this.operation = null;
                    return;
                }
                result = prev / current;
                break;
        }

        // Add to history
        const expression = `${prev} ${this.operation} ${current}`;
        this.addToHistory(expression, result);

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
            this.display.value = 'SECRET UNLOCKED!';
            this.display.style.color = '#00ff00';
            
            setTimeout(() => {
                this.display.value = '';
                this.display.style.color = '#00d4ff';
                this.clear();
            }, 2000);
        }
    }

    addToHistory(expression, result) {
        this.history.unshift({
            expression: expression,
            result: this.formatResult(result),
            timestamp: new Date().toLocaleTimeString()
        });

        // Limit history size
        if (this.history.length > this.maxHistoryItems) {
            this.history.pop();
        }

        this.saveHistory();
    }

    displayHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="empty-state">No history yet</p>';
            return;
        }

        historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div>
                    <div class="history-expression">${this.escapeHtml(item.expression)}</div>
                    <small>${item.timestamp}</small>
                </div>
                <div class="history-result">${this.escapeHtml(item.result)}</div>
            </div>
        `).join('');

        // Add click listeners to history items
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = item.dataset.index;
                this.currentValue = this.history[index].result;
                this.shouldResetDisplay = true;
                this.updateDisplay();
                document.getElementById('historyModal').classList.remove('show');
            });
        });
    }

    saveHistory() {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        } catch (e) {
            console.warn('Failed to save history:', e);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('calculatorHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load history:', e);
            this.history = [];
        }
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateDisplay() {
        this.display.value = this.currentValue || '0';
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});