const app = {}

app.baseURL = 'https://api.themoviedb.org';
app.apiKey = 'f00080dab1cea7e8d326650430040e5e';

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

app.userDay = (month) => {
    function numberOfDays(year, month) {
        const day = new Date(year, month+1, 0);
        return day.getDate();
    }
    const selectDaysEl = document.querySelector('#days');
    const returnDays = numberOfDays(2021, month);
    const daysInMonth = []
    for(let i = 1; i <= returnDays; i++) {
        daysInMonth.push(i)
    }
    daysInMonth.forEach(day => {
        console.log(day)
        const optionEl = document.createElement('option')
        optionEl.textContent = day;
        selectDaysEl.appendChild(optionEl)
    })
}


app.init = () => {
    app.userMonth();
}


app.init()