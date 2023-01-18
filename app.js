const balanceElement = document.getElementById("balance");
const outstandingLoanElement = document.getElementById("outstandingLoan");
const loanedAmountElement = document.getElementById("loanedAmount");
const getLoanButtonElement = document.getElementById("getLoan");

const salaryBalanceElement = document.getElementById("salaryBalance");
const bankButtonElement = document.getElementById("bankButton");
const workButtonElement = document.getElementById("workButton");
const repayButtonElement = document.getElementById("repayButton");

const baseUrl = "https://hickory-quilled-actress.glitch.me/"; //base url for laptop API data and images
const laptopsElement = document.getElementById("laptops");
const laptopSpecsElement = document.getElementById("specs");

const laptopNameElement = document.getElementById("laptopName");
const laptopDescriptionElement = document.getElementById("laptopDescription");
const laptopPriceElement = document.getElementById("laptopPrice");
const laptopBuyButtonElement = document.getElementById("laptopBuyButton");

const currencyEurFormat = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

let laptops = []; //fetched laptop objects
let balance = 0.0; //bank balance
let outstandingLoan = 0.0; //outstanding loan amount
let salaryBalance = 0.0; //balance that is can be used for loan payments or transferred to the bank balance
const salary = 100.0; //salary that is added to the salary balance

/**
 * Load initial values/api data for the page
 */
const initialize = () => {
  salaryBalanceAdjust(0);
  balanceAdjust(0);

  //Fetches the laptops using external API
  try {
    fetch(`${baseUrl}computers`)
      .then((response) => response.json())
      .then((data) => (laptops = data))
      .then((laptops) => addLaptopsToMenu(laptops));
  } catch (error) {
    console.log(`API fetch error: ${error}`);
  }
};

/**
 * Adjust the bank balance
 * @param {number} amount Amount can be positive or negative
 */
const balanceAdjust = (amount) => {
  balance += parseFloat(amount);
  balanceElement.innerText = currencyEurFormat.format(balance);
};

/**
 * Adjust the outstanding loan
 * @param {number} amount Amount can be positive or negative
 */
const loanAdjust = (amount) => {
  outstandingLoan += parseFloat(amount);
  loanedAmountElement.innerText = currencyEurFormat.format(outstandingLoan);
};

/**
 * Adjust the salary balance
 * @param {number} amount Amount can be positive or negative
 */
const salaryBalanceAdjust = (amount) => {
  salaryBalance += parseFloat(amount);
  salaryBalanceElement.innerText = currencyEurFormat.format(salaryBalance);
};

const addLaptopsToMenu = (laptops) => {
  laptops.forEach((x) => addLaptopToMenu(x));
  laptopsElement.selectedIndex = "0";
  handleLaptopSelectionChange();
};

const addLaptopToMenu = (laptop) => {
  const laptopElement = document.createElement("option");
  laptopElement.value = laptop.id;
  laptopElement.appendChild(document.createTextNode(laptop.title));
  laptopsElement.appendChild(laptopElement);
};

/**
 * Button handler for applying for a loan. It is not possible to get the loan if the loan
 * amount is too high or there is already an active loan (outstanding loan > 0).
 */
const handleGetLoan = () => {
  if (parseFloat(outstandingLoan) > 0) {
    alert(
      "You may not have multiple loans at once. The initial loan should be paid back in full."
    );
    return;
  }

  //prompt the user until a valid number is entered
  let loanAmount = "null";
  while (isNaN(loanAmount)) {
    const result = prompt(
      "Please enter the amount of money you wish to loan: "
    );
    if (result === null) {
      return; //prompt cancel
    }
    loanAmount = parseFloat(result);
  }

  //maximum loan 2*bank account balance
  if (loanAmount > 2 * balance) {
    alert("The requested loan amount is too high");
  } else {
    balanceAdjust(loanAmount);
    loanAdjust(loanAmount);
    repayButtonElement.style.display = "block"; //show the button used for paying back the loan
    outstandingLoanElement.style.visibility = "visible"; //show the outstanding loan amount
  }
};

/**
 * Button handler for transferring salary balance to the bank balance
 */
const handleBank = () => {
  //Use 0.1*salary balance for paying back the outstanding loan and transfer the rest to the bank balance
  if (outstandingLoan > 0) {
    let loanPayment = 0.1 * salaryBalance;
    if (loanPayment > outstandingLoan) {
      loanPayment = outstandingLoan;
    }
    loanAdjust(-loanPayment); //decrease loan
    salaryBalanceAdjust(-loanPayment); //increase salary balance
  }
  balanceAdjust(salaryBalance);
  salaryBalanceAdjust(-salaryBalance);
};

/**
 * Button handler for "working" (adding salary to the salary balance)
 */
const handleWork = () => {
  salaryBalanceAdjust(salary);
};

/**
 * Button handler for using salary balance to pay back the outstanding loan
 */
const handleRepay = () => {
  //Use the salary balance for paying back the loan and transfer the leftover to the bank account
  if (salaryBalance >= outstandingLoan) {
    const leftover = salaryBalance - outstandingLoan;
    loanAdjust(-outstandingLoan); //pay back the outstanding loan completely
    balanceAdjust(leftover); //add the leftover to the bank balance
    repayButtonElement.style.display = "none"; //hide the repay button
    outstandingLoanElement.style.visibility = "hidden"; //hide the outstanding loan element
  } else {
    loanAdjust(-salaryBalance); //pay back the loan
  }
  salaryBalanceAdjust(-salaryBalance); //reset the salary balance
};

/**
 * Handler for the laptop selection - shows the data included in the selected laptop
 * object and loads the image of the laptop.
 */
const handleLaptopSelectionChange = () => {
  const selectedLaptop = laptops[laptopsElement.selectedIndex];
  laptopSpecsElement.innerHTML = "";
  selectedLaptop.specs.forEach((x) => {
    const specElement = document.createElement("LI");
    specElement.innerText = x;
    laptopSpecsElement.appendChild(specElement);
  });

  laptopNameElement.innerText = selectedLaptop.title;
  laptopDescriptionElement.innerText = selectedLaptop.description;
  laptopPriceElement.innerText = currencyEurFormat.format(selectedLaptop.price);
  document.getElementById(
    "laptopImg"
  ).src = `${baseUrl}${selectedLaptop.image}`;
};

/**
 * Button handler for buying the selected laptop
 */
const handleBuyLaptop = () => {
  const selectedLaptop = laptops[laptopsElement.selectedIndex];
  const price = parseFloat(selectedLaptop.price);
  if (balance >= price) {
    balanceAdjust(-price);
    alert(
      `Congratulations, you just bought a ${selectedLaptop.title} for ${selectedLaptop.price}.`
    );
  } else {
    alert("Not enough funds to buy the selected laptop.");
  }
};

getLoanButtonElement.addEventListener("click", handleGetLoan);
bankButtonElement.addEventListener("click", handleBank);
workButtonElement.addEventListener("click", handleWork);
repayButtonElement.addEventListener("click", handleRepay);
laptopsElement.addEventListener("change", handleLaptopSelectionChange);
laptopBuyButtonElement.addEventListener("click", handleBuyLaptop);

initialize();
