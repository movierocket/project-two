const app = {}


app.baseURL = 'https://api.themoviedb.org';
app.apiKey = 'f00080dab1cea7e8d326650430040e5e';

// function runs on page load, and displays the months of the year into option items in dropdown menu.  Then listens for a click event to signal which month the user selected, and runs the app.userDay funtion with the month passed in

app.userMonth = () => {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    const selectMonthsEl = document.querySelector('[name="month"]');
    
    months.forEach(month => {
        const optionEl = document.createElement('option')
        optionEl.textContent = month;
        optionEl.setAttribute('value', month)
        selectMonthsEl.appendChild(optionEl)
    })
    
    selectMonthsEl.addEventListener('input', e => {
        app.userDay(e.target.selectedIndex)
    })
}

// function runs after user has selected the month.  It first returns the current year that the user is using the app.  We pass the year and selected month into a function that returns the number of days in the month the user has selected.  Loops through the numbers, and puts it into an array which we use to fill a drop down menu.
app.userDay = (month) => {
    const year = new Date().getFullYear();
    
    function numberOfDays(year, month) {
        const day = new Date(year, month+1, 0);
        return day.getDate();
    }
    
    const returnDays = numberOfDays(year, month);
    
    const selectDaysEl = document.querySelector('[name="day"]');
    
    const daysInMonth = [];

    for(let i = 1; i <= returnDays; i++) {
        daysInMonth.push(i)
    }

    function appendDay() {
        daysInMonth.forEach(day => {
            const optionEl = document.createElement('option');
            optionEl.textContent = day;
            optionEl.setAttribute('value', day);
            selectDaysEl.appendChild(optionEl);
        })
    }

    if(!selectDaysEl.childElementCount) {
        appendDay()
    } else {
        selectDaysEl.length = 1;
        appendDay()
    }
}

// function runs on page load.  Grabs the form element and listens for a submit event.  On submit, it prevents default action, and grabs the index of the users selected month and day.  We run an if statement to ensure that the user hasn't selected the default values of "MONTH" and "DAY".  If the user has selected legitimate values, it then passes these values as arguments to the app.retrieveDates function
app.selectUserInput = () => {
    const submit = document.querySelector('form');
    submit.addEventListener('submit', e => {
        e.preventDefault();

        const monthIndex = document.querySelector('[name="month"]').selectedIndex-1;
        const dayIndex = document.querySelector('[name="day"]').selectedIndex+1;

        if (monthIndex > -1 && dayIndex > 1) {
            app.retrieveDates(monthIndex, dayIndex)
        }
    })
}

// recieves users selected month and day as parameters. We then grab the current year the user is using the app.  With the current year, and the users selected month and day, we retrieve dates from 5,10 and 20 years prior in Iso format to be passed into API.  These dates are saved into an array.
app.retrieveDates = (month, day) => {
    const year = new Date().getFullYear();
    
    const fiveYearsAgo = new Date(year-5, month, day).toISOString().split('T')[0];
    const fiveYearsAgoWeek = new Date(year-5, month, day+6).toISOString().split('T')[0];
    const tenYearsAgo = new Date (year-10, month, day).toISOString().split('T')[0];
    const tenYearsAgoWeek = new Date(year-10, month, day+6).toISOString().split('T')[0];
    const twentyYearsAgo = new Date (year-20, month, day).toISOString().split('T')[0];
    const twentyYearsAgoWeek = new Date (year-20, month, day+6).toISOString().split('T')[0];

    const dates = [[fiveYearsAgo, fiveYearsAgoWeek], [tenYearsAgo, tenYearsAgoWeek], [twentyYearsAgo, twentyYearsAgoWeek]];

    app.fetchMovie(dates)
}

// function recieves dates in the form of an array.  We pass those date through a function called fetchMovie that takes in 2 arguments, a start and end date, which allows us to search for the entirety of the week.  This happens 3 times, with arrays of 5, 10 and 20 years.  This promise gets pushed into an array, which we then use promise.all() to resolve all 3 promises, and push the results into app.displayMovies()
app.fetchMovie = (dates) => {

    const promiseMovieArray = [];

    const fetchMovie = (start, end) => {
        promiseMovieArray.push(
            fetch(`${app.baseURL}/3/discover/movie?api_key=${app.apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${start}&primary_release_date.lte=${end}&with_original_language=en&with_watch_monetization_types=flatrate`)
            .then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    throw new Error(res.statusText);
                }
            })
        )
    }

    dates.forEach(date => {
        fetchMovie(date[0], date[1])
    })

    const movieResults = Promise.all(promiseMovieArray)
        .then(res => {
            app.displayMovies(res)
        })
        .catch(err => {
            if (err.message === "Not Found") {
                alert("We couldn't find your movie at this time.  Try again later.")
            } else {
                alert("Something went wrong.  Try again later.")
            }
        })
}

// function recieves 3 arrays of movies, 5, 10 and 20 years ago.  The function runs a nextMovie function that loops through the array of movies, and then destructures through the data.  We used the pased in information to create a block of HTML, that displays the information and appends it to the page.  We've also created a nextButton element that is also appended onto the page.  We run an event listener on this button that itirates through the movieIndex variable, and recalls the nextMovie function.  This allows us to relaunch our appended information with a new selection of movies from the same time frame.
app.displayMovies = (movies) => {
    const results = document.querySelector('.results');
    const relaunch = document.querySelector('.relaunch')

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Relaunch';
    nextButton.classList.add('relaunchButton');
    
    let movieIndex = 0;

    const nextMovie = () => {
        results.innerHTML = '';
        
        movies.forEach(movie => {
            
            const { original_title, overview, poster_path, release_date, vote_average } = movie.results[movieIndex];

            const newListElement = document.createElement('li');
            newListElement.innerHTML =`
            <div class="movieResults">
                <div class="wrapper">
                    <div class="imgContainer">
                        <img class="innerImg" src="https://www.themoviedb.org/t/p/w220_and_h330_face/${poster_path}" alt="${original_title}">
                    </div>    
                    <div class="movieText">
                        <h2>${original_title}</h2>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <p>${vote_average}</p>
                        </div>    
                        <h3>Released ${release_date}</h3>
                        <p>${overview}</p>
                    </div>
                </div>        
            </div>
            `;
            results.appendChild(newListElement);
        })
        relaunch.appendChild(nextButton);
    }

    nextButton.addEventListener("click",() => {
        movieIndex++;
        nextMovie();
    });

    nextMovie();
}

app.init = () => {
    app.userMonth();
    app.selectUserInput();
}

app.init()