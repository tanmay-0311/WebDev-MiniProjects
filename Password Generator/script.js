const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const upperCaseCheck = document.querySelector('#uppercase');
const lowerCaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generate-button');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = '!@#$%^&*()~_+=-`~;:",./?><';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// SET STRENGTH CIRCLE COLOR TO GREY

// SET PASSWORD LENGTH
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
}

function getRndInteger(min, max) {
    return Math.floor (Math.random() * (max-min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength () {
    let hasUpper = false;
    let hasLower = false;
    let hasSym = false;
    let hasNum = false;

    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum && hasSym) && passwordLength >= 6) {
        setIndicator("#0ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePass(arr) {
    // FISHER YATES METHOD
    for (let i=arr.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp
    }

    let str = "";
    arr.forEach((el) => (
        str += el
    ));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) {
            checkCount++;
        }
    });

    // SPECIAL CONDITION
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach ((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generateBtn.addEventListener('click', () => {
    if(checkCount <= 0) return;

    if (passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("Joruney Started");

    // REMOVE OLD PASSWORD
    password = "";

    // LETS PUT THE STUFF MENTIONED BY CHECKBOXES
    // if(upperCaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowerCaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(upperCaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }

    if(lowerCaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }


    // COMPULSORY ADDITION
    for (let i=0; i<funcArr.length; i++) {
        password += funcArr[i] ();
    }

    console.log("COMPULSORY ADDITION DONE");


    // REMAINING ADDITION
    for (let i=0; i<passwordLength - funcArr.length; i++) {
        let rndInd = getRndInteger(0, funcArr.length);
        password += funcArr[rndInd] ();
    }

    console.log("REMAINING ADDITION DONE");


    // SHUFFLE THE PASSWORD
    password = shufflePass(Array.from(password));

    console.log("Shuffle done");

    // SHOW IN UI
    passwordDisplay.value = password;

    // CALC STRENGTH 
    calcStrength();
});