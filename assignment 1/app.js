const balanceElement = document.getElementById("balance");
const outstandingLoanElement = document.getElementById("outstandingLoan");
const loanedAmountElement = document.getElementById("loanedAmount");
const getLoanButtonElement = document.getElementById("getLoan");

const salaryBalanceElement = document.getElementById("salaryBalance");
const bankButtonElement = document.getElementById("bankButton");
const workButtonElement = document.getElementById("workButton");
const repayButtonElement = document.getElementById("repayButton");

const baseUrl = "https://hickory-quilled-actress.glitch.me/";
const laptopsElement = document.getElementById("laptops");
const laptopSpecsElement = document.getElementById("specs");

const laptopNameElement = document.getElementById("laptopName");
const laptopDescriptionElement = document.getElementById("laptopDescription");
const laptopPriceElement = document.getElementById("laptopPrice");
const laptopBuyButtonElement = document.getElementById("laptopBuyButton");

let laptops = []; //fetched laptop objects
let balance = 0; //bank balance
let outstandingLoan = 0; //outstanding loan amount
let salaryBalance = 0; //balance that is can be used for loan payments or transferred to the bank balance
const salary = 100; //salary that is added to the salary balance

/**
 * Load initial values for the page
 */
const initialize = () => {
  salaryBalanceAdjust(0);
  balanceAdjust(0);

  //Fetches the laptops using external API
  fetch(`${baseUrl}computers`)
    .then((response) => response.json())
    .then((data) => (laptops = data))
    .then((laptops) => addLaptopsToMenu(laptops));
};

/**
 * Adjust the bank balance
 * @param {int} amount Amount can be positive or negative
 */
const balanceAdjust = (amount) => {
  balance += amount;
  balanceElement.innerText = balance;
};

/**
 * Adjust the outstanding loan
 * @param {int} amount Amount can be positive or negative
 */
const loanAdjust = (amount) => {
  outstandingLoan += amount;
  loanedAmountElement.innerText = outstandingLoan;
};

/**
 * Adjust the salary balance
 * @param {int} amount Amount can be positive or negative
 */
const salaryBalanceAdjust = (amount) => {
  salaryBalance += amount;
  salaryBalanceElement.innerText = salaryBalance;
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
  const loanAmount = parseInt(
    prompt("Please enter the amount of money you wish to loan: ")
  );
  if (parseInt(outstandingLoan) > 0) {
    alert(
      "You may not have two loans at once. The initial loan should be paid back in full."
    );
  } else if (loanAmount > 2 * balance) {
    alert("The requested loan amount is too high");
  } else {
    balanceAdjust(loanAmount);
    loanAdjust(loanAmount);
    repayButtonElement.style.visibility = "visible";
    outstandingLoanElement.style.visibility = "visible";
  }
};

/**
 * Button handler for transferring salary balance to the bank balance
 */
const handleBank = () => {
  //Use 0.1*salary balance for paying back the outstanding loan and transfer the rest to the bank balance
  if (outstandingLoan > 0) {
    const loanPayment = 0.1 * salaryBalance;
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
  if (salaryBalance >= outstandingLoan) {
    const leftover = salaryBalance - outstandingLoan;
    loanAdjust(-outstandingLoan); //pay back the outstanding loan completely
    balanceAdjust(leftover); //add the leftover to the bank balance
    repayButtonElement.style.visibility = "hidden"; //hide the repay button
    outstandingLoanElement.style.visibility = "hidden"; //hide the outstanding loan element
  } else {
    loanAdjust(-salaryBalance);
  }
  salaryBalanceAdjust(-salaryBalance);
};

/**
 * Handler for the laptop selection - shows the data related to the selected laptop and loads the
 * image of the laptop.
 * @param {*} e
 */
const handleLaptopSelectionChange = (e) => {
  const selectedLaptop = laptops[laptopsElement.selectedIndex];
  laptopSpecsElement.innerHTML = "";
  selectedLaptop.specs.forEach((x) => {
    const specElement = document.createElement("LI");
    specElement.innerText = x;
    laptopSpecsElement.appendChild(specElement);
  });

  laptopNameElement.innerText = selectedLaptop.title;
  laptopDescriptionElement.innerText = selectedLaptop.description;
  laptopPriceElement.innerText = selectedLaptop.price;
  document.getElementById(
    "laptopImg"
  ).src = `${baseUrl}${selectedLaptop.image}`;
};

/**
 * Button handler for buying the selected laptop
 */
const handleBuyLaptop = () => {
  const selectedLaptop = laptops[laptopsElement.selectedIndex];
  const price = parseInt(selectedLaptop.price);
  if (price < balance) {
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
