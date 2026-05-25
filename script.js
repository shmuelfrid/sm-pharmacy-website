// Family Vacation Cost Calculator
const STORAGE_KEY = 'vacationCalculator';
const FIELDS = ['people', 'days', 'costPerDay', 'food', 'other'];

const inputs = {};
FIELDS.forEach(id => { inputs[id] = document.getElementById(id); });

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Read a field as a non-negative number (blank/invalid -> 0)
function val(id) {
  const n = parseFloat(inputs[id].value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function calculate() {
  const people = val('people');
  const days = val('days');
  const costPerDay = val('costPerDay');
  const food = val('food');
  const other = val('other');

  const lodging = days * costPerDay;
  const foodTotal = days * people * food;
  const total = lodging + foodTotal + other;

  // Headline numbers
  document.getElementById('totalCost').textContent = money.format(total);
  document.getElementById('perPerson').textContent = money.format(people > 0 ? total / people : 0);
  document.getElementById('perDay').textContent = money.format(days > 0 ? total / days : 0);

  // Breakdown
  document.getElementById('bdLodging').textContent = money.format(lodging);
  document.getElementById('bdFood').textContent = money.format(foodTotal);
  document.getElementById('bdOther').textContent = money.format(other);

  // Proportional bar
  const pct = v => (total > 0 ? (v / total) * 100 : 0);
  document.getElementById('barLodging').style.width = pct(lodging) + '%';
  document.getElementById('barFood').style.width = pct(foodTotal) + '%';
  document.getElementById('barOther').style.width = pct(other) + '%';
}

function save() {
  const data = {};
  FIELDS.forEach(id => { data[id] = inputs[id].value; });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Storage may be unavailable (e.g. private mode); calculator still works.
  }
}

function load() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    data = null;
  }
  if (!data) return;
  FIELDS.forEach(id => {
    if (data[id] !== undefined) inputs[id].value = data[id];
  });
}

// Wire up live updates
FIELDS.forEach(id => {
  inputs[id].addEventListener('input', () => {
    calculate();
    save();
  });
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
  FIELDS.forEach(id => { inputs[id].value = ''; });
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) { /* ignore */ }
  calculate();
  inputs.people.focus();
});

// Restore saved values and render on load
load();
calculate();
