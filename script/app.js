const app = {}


app.baseURL = 'https://api.themoviedb.org';
app.apiKey = 'f00080dab1cea7e8d326650430040e5e';

// function runs on page load, and displays the months of the year into option items in dropdown menu.  Then listens for a click event to signal which month the user selected, and runs the app.userDay funtion with the month passed in

app.userMonth = () => {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const selectMonthsEl = document.querySelector('#months')

    months.forEach(month => {
        const optionEl = document.createElement('option')
        optionEl.textContent = month;
        selectMonthsEl.appendChild(optionEl)
    })

    const indexMonth = selectMonthsEl.addEventListener('click', e => {
        app.userDay(e.target.index)
    })
}

// function runs after user has selected the month.  It first returns the current year that the user is using the app.  We pass the year and selected month into a function that returns the number of days in the month the user has selected.  Loops through the numbers, and puts it into an array which we use to fill a drop down menu.
app.userDay = (month) => {
    function getYear() {
        const date = new Date();
        const getYear = date.getFullYear();
        return getYear;
    }
    const year = getYear();

    function numberOfDays(year, month) {
        const day = new Date(year, month+1, 0);
        return day.getDate();
    }
    const returnDays = numberOfDays(year, month);

    const selectDaysEl = document.querySelector('#days');
    const daysInMonth = [];

    for(let i = 1; i <= returnDays; i++) {
        daysInMonth.push(i)
    }

    daysInMonth.forEach(day => {
        const optionEl = document.createElement('option')
        optionEl.textContent = day;
        selectDaysEl.appendChild(optionEl)
    })
}

// function runs on page load.  Grabs the form element and listens for a submit event.  On submit, it prevents default action, and grabs the index of the users selected month and day.  It then passes these values as arguments to the app.retrieveDates function
app.selectUserInput = () => {
    const submit = document.querySelector('form');
    submit.addEventListener('submit', e => {
        e.preventDefault();
        const monthIndex = document.querySelector('#months').selectedIndex;
        const dayIndex = document.querySelector('#days').selectedIndex+1;
        app.retrieveDates(monthIndex, dayIndex)
    })
}

app.retrieveDates = (month, day) => {
    function getYear() {
        const date = new Date();
        const getYear = date.getFullYear();
        return getYear;
    }
    const year = getYear();
    const userSelectedDate = new Date(year, month, day).toISOString().split('T')[0];
    
    const fiveYearsAgo = new Date(year-5, month, day).toISOString().split('T')[0];
    const tenYearsAgo = new Date (year-10, month, day).toISOString().split('T')[0];
    const twentyYearsAgo = new Date (year-20, month, day).toISOString().split('T')[0];
    console.log(userSelectedDate ,fiveYearsAgo, tenYearsAgo, twentyYearsAgo)
}

app.init = () => {
    app.userMonth();
    app.selectUserInput();
}


app.init()