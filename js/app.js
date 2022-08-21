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
let fee = EBAYFEE, sellingPlatform = "ebay", final, profit;

// Updates map to get current value from inputs
inputs.forEach(input => {

    input.addEventListener("input", () => {

        if(input.valueAsNumber >= 0) {

            // key = input's id, value = input's data
            map[input.id] = input.valueAsNumber;

            setFinalFee();
            setProfit(final);
            updateChart();
            
        } 
        
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

        if(map["soldPrice"] >= 0) {
            
            setFinalFee();
            setProfit(final);
            updateChart();

        }
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
    fee = EBAYFEE;

    feeTotal.textContent = "$0.00";
    profitTotal.textContent = "$0.00";

    setFontSize(3, feeTotal);
    setFontSize(3, profitTotal);

    Object.keys(map).forEach(key => {

        map[key] = 0;

    });

    myChart.data["datasets"][0].data[0] = EBAYFEE;
    myChart.data["datasets"][0].data[1] = 0
    myChart.update();

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

function getProfit() {

    return (map["soldPrice"] - final - map["shippingCost"] - map["itemCost"] + map["shippingCharged"]).toFixed(2);

}

function setProfit() {

    profit = getProfit();
    
    setFontSize(profit.length, profitTotal);

    isNaN(profit) ? profitTotal.textContent = "$0.00" : profitTotal.textContent = `$${profit}`;
}

function setFinalFee() {
    final = getFinalFee(sellingPlatform, fee); 

    setFontSize(final.length, feeTotal);

    isNaN(final) ? feeTotal.textContent = "$0.00" : feeTotal.textContent = `$${final}`;
}

function setFontSize(length, element) {

    if(length < 5) element.style.fontSize = "2.5rem";
    else if(length <= 7) element.style.fontSize = "2.25rem";
    else if(length <= 9) element.style.fontSize = "2rem";
    else if(length <= 19) element.style.fontSize = "1rem";
    else element.style.fontSize = ".75rem";

}

function updateChart() {

    if(parseFloat(profit) < 0) {

        myChart.data["datasets"][0].data[0] = parseFloat(final) - parseFloat(profit);
        myChart.data["datasets"][0].data[1] = 0;

    } else {

        myChart.data["datasets"][0].data[0] = parseFloat(final);
        myChart.data["datasets"][0].data[1] = parseFloat(profit)

    }

    myChart.update();

}

function createChart() {
    
      const data = {
        datasets: [{
          label: 'My First dataset',
          backgroundColor: ['rgb(255, 99, 132)', 'hsl(172, 67%, 45%)'],
          borderColor: ['rgb(255, 99, 132)', 'hsl(172, 67%, 45%)'],
          data: [-0.30, .30],
        }]
      };
    
      const config = {
        type: 'pie',
        data: data,
        options: {}
      };

      myChart = new Chart(
        document.getElementById('chart'),
        config
      );
}

createChart();