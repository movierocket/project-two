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

    function appendDay() {
        daysInMonth.forEach(day => {
            const optionEl = document.createElement('option');
            optionEl.textContent = day;
            selectDaysEl.appendChild(optionEl)
        })
    }

    if(!selectDaysEl.childElementCount) {
        appendDay()
    } else {
        selectDaysEl.length = 0;
        appendDay()
    }
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

// recieves users selected month and day as parameters. We then grab the current year the user is using the app.  With the current year, and the users selected month and day, we retrieve dates from 5,10 and 20 years prior in Iso format to be passed into API.  These dates are saved into an array.
app.retrieveDates = (month, day) => {
    const year = new Date().getFullYear();
    
    const fiveYearsAgo = new Date(year-5, month, day).toISOString().split('T')[0];
    const fiveYearsAgoWeek = new Date(year-5, month, day+7).toISOString().split('T')[0];
    const tenYearsAgo = new Date (year-10, month, day).toISOString().split('T')[0];
    const tenYearsAgoWeek = new Date(year-10, month, day+7).toISOString().split('T')[0];
    const twentyYearsAgo = new Date (year-20, month, day).toISOString().split('T')[0];
    const twentyYearsAgoWeek = new Date (year-20, month, day+7).toISOString().split('T')[0];

    const dates = [fiveYearsAgo, fiveYearsAgoWeek, tenYearsAgo, tenYearsAgoWeek, twentyYearsAgo, twentyYearsAgoWeek];
    app.fetchMovie(dates)
}

app.fetchMovie = (dates) => {
    console.log(dates)
    const url = new URL(`${app.baseURL}/3/discover/movie?api_key=${app.apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${dates[0]}&primary_release_date.lte=${dates[1]}&with_original_language=en&with_watch_monetization_types=flatrate`);


    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
}

app.init = () => {
    app.userMonth();
    app.selectUserInput();
}


app.init()