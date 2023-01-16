const balanceElement = document.getElementById("balance");
const outstandingLoanElement = document.getElementById("outstandingLoan");
const loanedAmountElement = document.getElementById("loanedAmount");
const getLoanButtonElement = document.getElementById("getLoan");

let balance = 201;
let outstandingLoan = 0;
balanceElement.innerText = balance;

const handleGetLoan = () => {
  const loanAmount = parseInt(prompt(
    "Please enter the amount of money you wish to loan: "
  ));
  if (parseInt(outstandingLoan) > 0) {
    alert(
      "You may not have two loans at once. The initial loan should be paid back in full."
    );
  } else if (loanAmount > 2 * balance) {
    alert("The requested loan amount is too high");
  } else {
    balanceAdjust(loanAmount)
    loanAdjust(loanAmount);
    repayButtonElement.style.visibility="visible";
    outstandingLoanElement.style.visibility="visible";
  }
};

const balanceAdjust=(amount)=>{
    balance +=amount;
    balanceElement.innerText = balance;
}

const loanAdjust=(amount)=>{
    outstandingLoan +=amount;
    loanedAmountElement.innerText = outstandingLoan;
}

const salaryBalanceAdjust=(amount)=>{
    salaryBalance +=amount;
    salaryBalanceElement.innerText = salaryBalance;
}

getLoanButtonElement.addEventListener("click", handleGetLoan);



const salaryBalanceElement = document.getElementById("salaryBalance");
const bankButtonElement = document.getElementById("bankButton");
const workButtonElement = document.getElementById("workButton");
const repayButtonElement = document.getElementById("repayButton");

let salaryBalance = 0;
const salary = 100;
salaryBalanceAdjust(0);

const handleBank = () => {
    if(outstandingLoan>0){
        const loanPayment = 0.1*salaryBalance;
        if (loanPayment > outstandingLoan){
            loanPayment = outstandingLoan;
        }
        loanAdjust(-loanPayment);
        salaryBalanceAdjust(-loanPayment);
    }
    balanceAdjust(salaryBalance);
    salaryBalanceAdjust(-salaryBalance); 
};
const handleWork = () => {
    salaryBalanceAdjust(salary);
};
const handleRepay = () => {
    if(salaryBalance>=outstandingLoan){
        const leftover = salaryBalance-outstandingLoan;
        loanAdjust(-outstandingLoan);
        balanceAdjust(leftover);
        repayButtonElement.style.visibility="hidden";
        outstandingLoanElement.style.visibility="hidden";
    }else{
        loanAdjust(-salaryBalance);
    }
    salaryBalanceAdjust(-salaryBalance);
};

bankButtonElement.addEventListener("click", handleBank);
workButtonElement.addEventListener("click", handleWork);
repayButtonElement.addEventListener("click", handleRepay);





const baseUrl = "https://hickory-quilled-actress.glitch.me/";
const laptopsElement = document.getElementById("laptops");
const laptopSpecsElement = document.getElementById("specs");
let laptops = [];

const laptopNameElement = document.getElementById("laptopName");
const laptopDescriptionElement = document.getElementById("laptopDescription");
const laptopPriceElement = document.getElementById("laptopPrice");
const laptopBuyButtonElement = document.getElementById("laptopBuyButton");

fetch(`${baseUrl}computers`)
.then(response =>response.json())
.then(data=>laptops=data)
.then(laptops=>addLaptopsToMenu(laptops))

const addLaptopsToMenu=(laptops)=>{
    laptops.forEach(x =>
        addLaptopToMenu(x)
    );
    laptopsElement.selectedIndex="0";
    handleLaptopSelectionChange();
}
const addLaptopToMenu=(laptop)=>{
    const laptopElement=document.createElement("option")
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopsElement.appendChild(laptopElement);
}

const handleLaptopSelectionChange=(e)=>{
    const selectedLaptop = laptops[laptopsElement.selectedIndex];
    laptopSpecsElement.innerHTML="";
    selectedLaptop.specs.forEach(x =>{
        const specElement=document.createElement("LI");
        specElement.innerText = x;
        laptopSpecsElement.appendChild(specElement)
    });

    laptopNameElement.innerText=selectedLaptop.title;
    laptopDescriptionElement.innerText=selectedLaptop.description;
    laptopPriceElement.innerText=selectedLaptop.price;
    document.getElementById("laptopImg").src=`${baseUrl}${selectedLaptop.image}`;
}

const handleBuyLaptop = () => {
    const selectedLaptop = laptops[laptopsElement.selectedIndex];
    const price = parseInt(selectedLaptop.price);
    if (price < balance) {
        balanceAdjust(-price);
      alert(
        `Congratulations, you just bought a ${selectedLaptop.title} for ${selectedLaptop.price}.`
      );
    } else {
      alert(
        "Not enough funds to buy the selected laptop."
      );
    }
  };

laptopsElement.addEventListener("change", handleLaptopSelectionChange);
laptopBuyButtonElement.addEventListener("click", handleBuyLaptop);

