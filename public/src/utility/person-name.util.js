function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomAnonymousName() {
    return '#' + getRandomInt(99999);
}

function promptPersonName() {
    var personName = localStorage.getItem('personName');
    if (personName && personName !== '') {
        personName = prompt("Please enter your name", personName);
    } else {
        personName = prompt("Please enter your name", getRandomAnonymousName());
    }
    if (personName === '') {
        personName = getRandomAnonymousName();
        localStorage.setItem('personName', personName);
    } else if (!personName) { // cancel button clicked
        if(!localStorage.getItem('personName')){
            personName = getRandomAnonymousName();
            localStorage.setItem('personName', personName);
        }
    } else {
        localStorage.setItem('personName', personName);
    }
    return personName;
}