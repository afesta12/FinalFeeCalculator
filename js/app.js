// Final value fee constants
const EBAYFEE = 0.116, MERCARIFEE = .029, PAYPALFEE = 0.0349;

// Inputs
const inputs = document.querySelectorAll(".input");

// Buttons / active states
const buttons = document.querySelectorAll(".btn");
let active = document.querySelector(".active");
const resetButton = document.querySelector(".reset");

// Output
let feeTotal = document.querySelector(".totalFee");
let profitTotal = document.querySelector(".totalProfit");

// Map to hold all values of inputs
let map = {

    "soldPrice": 0,
    "shippingCharged": 0,
    "shippingCost": 0,
    "itemCost": 0

};

// Default fee & selling platform are ebay
let fee = EBAYFEE, sellingPlatform = "ebay", final;

// Updates map to get current value from inputs
inputs.forEach(input => {

    input.addEventListener("input", () => {

        // key = input's id, value = input's data
        map[input.id] = input.valueAsNumber;

        setFinalFee();

    })

});

buttons.forEach(button => {

    button.addEventListener("click", () => {

        active.classList.remove("active");
        button.classList.add("active");
        active = button;

        sellingPlatform = button.id;

        if(sellingPlatform === "mercari") fee = MERCARIFEE;
        else if(sellingPlatform === "paypal") fee = PAYPALFEE;
        else fee = EBAYFEE; // default to ebay fee

        setFinalFee();
        
    })

});

// Reset values to default
resetButton.addEventListener("click", () => {

    inputs.forEach(input => {

        input.value = '';

    })

    active.classList.remove("active");
    const ebay = document.getElementById("ebay");
    ebay.classList.add("active");
    active = ebay;

})

// Final value fee calculations
function ebayFee(fee) {
    return ((map["soldPrice"] * fee) + .30).toFixed(2);
}

function mercariFee(fee) {

    return ((map["soldPrice"] * fee) + (map["soldPrice"] * 0.10) + .30).toFixed(2);

}

function payPalFee(fee) {

    return ((map["soldPrice"] * fee) + 0.49).toFixed(2);
}

function getFinalFee(sellingPlatform, fee) {

    if(sellingPlatform === "mercari") return mercariFee(fee);
    else if(sellingPlatform === "paypal") return payPalFee(fee);
    else return ebayFee(fee);
 
}

function setFinalFee() {
    final = getFinalFee(sellingPlatform, fee);

    isNaN(final) ? feeTotal.textContent = "$0.00" : feeTotal.textContent = `$${final}`;
}