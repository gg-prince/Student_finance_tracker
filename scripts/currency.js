const CURRENCY_DEFAULTS = {
    baseCurrency: "USD",
    otherCurrencies: [{code: "EUR", rate: 0.92}, {code: "RWF", rate: 1450}],
    displayCurrency: "USD",
    cap: null,
    categories: ["Food", "Books", "Transport", "Entertainment", "Fees", "Other"]
};

function loadCurrencySettings(){
    try{
        const saved = JSON.parse(localStorage.getItem("settings"));
        if(saved && saved.baseCurrency && Array.isArray(saved.otherCurrencies) && saved.otherCurrencies.length === 2){
            return saved;
        }
    }catch(e){
        console.error("Saved settings were unreadable, using defaults:", e);
    }
    return JSON.parse(JSON.stringify(CURRENCY_DEFAULTS));
}

// 1 base unit = this many units of the chosen currency
function currencyRate(settings, code){
    if(code === settings.baseCurrency) return 1;
    const other = settings.otherCurrencies.find(c => c.code === code);
    return other ? other.rate : 1;
}

// formatMoney(12.5) = "$12.50", "€11.50" or "RWF 18,125" depending on the dropdown
function formatMoney(amountBase){
    const settings = loadCurrencySettings();
    const code = settings.displayCurrency;
    const value = Number(amountBase) * currencyRate(settings, code);
    try{
        return new Intl.NumberFormat("en-US", {style: "currency", currency: code}).format(value).replace(/\u00a0/g, " ");
    }catch(e){
        return code + " " + value.toFixed(2);
    }
}

function setupCurrencyDropdown(){
    const select = document.querySelector(".currency");
    if(!select) return;

    const settings = loadCurrencySettings();
    select.innerHTML = "";
    [settings.baseCurrency, settings.otherCurrencies[0].code, settings.otherCurrencies[1].code].forEach(code => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = code;
        select.appendChild(option);
    });
    select.value = settings.displayCurrency;

    select.addEventListener("change", () => {
        const current = loadCurrencySettings();
        current.displayCurrency = select.value;
        localStorage.setItem("settings", JSON.stringify(current));

        if(typeof onCurrencyChange === "function") onCurrencyChange();
    });
}

document.addEventListener("DOMContentLoaded", setupCurrencyDropdown);
