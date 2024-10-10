const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyButton = document.querySelector("[data-copyButton]");
const copyMessage = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".lastButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = "";
let passwordLength = 12;
let checkCount = 0;
handleSlider();
// circle color
setIndicator("#ccc");

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
        ((passwordLength - min) * 100) / (max - min) + "% 100%";
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
    return getRandom(0, 9);
}
function generateLowerCase() {
    return String.fromCharCode(getRandom(97, 123));
}
function generateUpperCase() {
    return String.fromCharCode(getRandom(65, 91));
}
function generateSymbol() {
    const randnum = getRandom(0, symbols.length);
    return symbols.charAt(randnum);
}
// function calcStrength() {
//     let hasUpper = false;
//     let hasLower = false;
//     let hasNum = false;
//     let hasSym = false;
//     if (uppercaseCheck.checked) hasUpper = true;
//     if (lowercaseCheck.checked) hasLower = true;
//     if (numbersCheck.checked) hasNum = true;
//     if (symbolCheck.checked) hasSym = true;

//     if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 12) {
//         setIndicator("#0f0");
//     } else if (
//         (hasLower || hasUpper) &&
//         (hasNum || hasSym) &&
//         passwordLength >= 8
//     ) {
//         setIndicator("#ff0");
//     } else {
//         setIndicator("#f00");
//     }
// }
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    const strengthText = document.getElementById("strengthText");

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 12) {
        setIndicator("#0f0");
        strengthText.textContent = "Strong Password";
        strengthText.style.color = "#0f0";
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 8
    ) {
        setIndicator("#ff0");
        strengthText.textContent = "Moderate Password";
        strengthText.style.color = "#ff0";
    } else {
        setIndicator("#f00");
        strengthText.textContent = "Weak Password";
        strengthText.style.color = "#f00";
    }
}

function setIndicator(color) {
    document.querySelector('.indicator').style.backgroundColor = color;
}
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "Copied";
    } catch (e) {
        copyMessage.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMessage.classList.add("active");

    setTimeout(() => {
        copyMessage.classList.remove("active");
    }, 2000);
}
inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});
copyButton.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
generateButton.addEventListener("click", () => {
    if (checkCount <= 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    // if (uppercaseCheck.checked) {
    //   password += generateUpperCase();
    // }
    // if (lowercaseCheck.checked) {
    //   password += generateLowerCase();
    // }
    // if (numbersCheck.checked) {
    //   password += generateRandomNumber();
    // }
    // if (symbolCheck.checked) {
    //   password += generateSymbol();
    // }
    let funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolCheck.checked) funcArr.push(generateSymbol);
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randindex = getRandom(0, funcArr.length);
        password += funcArr[randindex]();
    }
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});