const wrapper = document.querySelector(".wrapper");
inputPart = wrapper.querySelector(".input-part");
infoTxt = inputPart.querySelector(".info-txt");
inputField = inputPart.querySelector("input");
locationBtn = inputPart.querySelector("button");
wIcon = document.querySelector(".weather-part img");
arrowBack = wrapper.querySelector("header i");

const apiKey = "9795ec7faf6e5a9e955e7f21ed6fcd6d";
const newApi = "ee7c4b79648c7ec65f4c16b0b11a0ffe";

//нажатие кнопки enter
inputField.addEventListener("keyup", e=>{
    //если пользователь нажмет enter в поле input и значение != ""
    if (e.key == "Enter" && inputField.value !=""){
        requestApi(inputField.value);
    }
});

//нажатие кнопки получить текущее местоположение
locationBtn.addEventListener("click", ()=>{
    //если браузер поддерживает geolocation api
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        //если браузер не поддерживает
        alert("Your browser not support geolocation api")
    }
});

//реализация нажатия по кнопке назад
arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
    const weekWeather = document.querySelector(".weekWeather");
    weekWeather.style.display="none";
    const weekWeatherDays = document.querySelector(".weekWeather__days");
    weekWeatherDays.innerHTML = '';
})

//получаем погоду через координаты пользователя
function onSuccess(position){
    //получение широты и долготы пользовательского девайса
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    apiWeek=`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");

}

//получаем погоду через введенный город
function requestApi(city){
    api =`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;          
    apiWeek=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

//обращение через api
function fetchData(){
    infoTxt.innerText = "Getting weather details..."
    infoTxt.classList.add("pending");
    //fetch(URL)-простой Get запрос - скачает содержимое по адресу URL
    //responce.json - декодирует ответ в JSON
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
    fetch(apiWeek).then(response => response.json()).then(result => weekWeather(result));
}

//функция вывода погоды на сегодня
function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`
    } else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        wIcon.src = getImage(id);

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText =description;
        wrapper.querySelector(".location span").innerText =`${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText =Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText =`${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

//функция вывода погоды на 5 дней вперед
function weekWeather(info){
    for (let i=0; i < info.list.length; i+=1){
        //получает дату день.месяц
        let date = info.list[i].dt_txt.slice(8, 10)+"."+info.list[i].dt_txt.slice(5, 7);
        //получаем время
        let time = info.list[i].dt_txt.slice(11);
        
        //погоду на следующие дни будем выводить по полудню
        if(time=="12:00:00"){
            const temp = Math.floor(info.list[i].main.temp);
            const feels_like = Math.floor(info.list[i].main.feels_like);
            const {description, id} = info.list[i].weather[0];
            renderDay(date, id, description, temp, feels_like);
        }
    }
    const weekWeather = document.querySelector(".weekWeather");
    weekWeather.style.display="flex";
    console.log(weekWeather);
}

//функция ренедеринга погоды на 5 дней
function renderDay(date, id, description, temp, feels_like){
    const img = getImage(id);

    const HTML=    `
        <div class="weekWeather__day">
            <div class="date">${date}</div>
            <img src=${img} alt="img" class="weekWeather__img">
            <div class="weekWeather__description">${description}</div>
            <div class="weekWeather__temp">${temp}°С</div>
            <div class="weekWeather__feelsLike">
                <div class="feelsLike__description">Feels like</div>
                <div class="feelsLike__value">${feels_like}°С</div>
            </div>
        </div>`;

  const parent = document.querySelector(".weekWeather__days");
  parent.insertAdjacentHTML('beforeend', HTML);

}

//функция получения картинки по id погоды
function getImage(id){
    let img =""
    if(id == 800){
        img = "icons/clear.svg";
    }else if(id >= 200 && id <= 232){
        img = "icons/storm.svg";  
    }else if(id >= 600 && id <= 622){
        img = "icons/snow.svg";
    }else if(id >= 701 && id <= 781){
        img = "icons/haze.svg";
    }else if(id >= 801 && id <= 804){
        img = "icons/cloud.svg";
    }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
        img = "icons/rain.svg";
    }
    return img
}
