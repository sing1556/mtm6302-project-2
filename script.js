
// get needed elements by ID

const $date = document.getElementById("date");
const $getPic = document.getElementById("getPic");
const $chosenDate = document.getElementById("chosenDate");
const $apiTitle = document.getElementById("apiTitle");
const $apiDate = document.getElementById("apiDate");
const $addFav = document.getElementById("addFav");
const $apiPic = document.getElementById("apiPic");
const $apiAbout = document.getElementById("apiAbout");
const $favourites = document.getElementById("favourites");
const $fullPic = document.getElementById("fullPic");
const $apiFullSize = document.getElementById("apiFullSize");
let favArray = [];
const apiData = [];

if (localStorage.getItem("arrayData")) {
    favArray = JSON.parse(localStorage.getItem("arrayData"));
    buildList();
};



let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1;
let yyyy = today.getFullYear();
if(dd<10){
  dd='0'+dd
} ;
if(mm<10){
  mm='0'+mm
} ;

today = yyyy+'-'+mm+'-'+dd;
$date.setAttribute("max", today);

//NASA data

const url = 'https://api.nasa.gov/planetary/apod?api_key=c7QQ9mC2b3SNGyzIHQp6HZnWpOvby97beI8AdOEc&date=';

const fetchNASAData = async () => {
  try {
    const response = await fetch(`${url}${$date.value}`);
    const apiData = await response.json();
    console.log('NASA APOD data', apiData);
    displayData(apiData);
  } catch (error) {
    console.log(error);
  }
};

function deleteFav(e) {
    e.preventDefault();
    const buttonName = e.target.id;
    const noOfButton = buttonName.replace("favBtnId","");
    const favDivId = "favId" + noOfButton;
    document.getElementById(favDivId).remove();
    favArray.splice(noOfButton - 1, 1);
    localStorage.clear;
    const newArray = JSON.stringify(favArray);
    localStorage.setItem('arrayData', newArray);
};

function goBackToFavorite(e) {
    const favName = e.target.id;
    const noOfFav = favName.slice(6);
    const iOfFav = noOfFav - 1;
    $apiTitle.textContent = favArray[iOfFav].title;
    $apiDate.textContent = favArray[iOfFav].date;
    $apiPic.src = favArray[iOfFav].link;
    $apiAbout.textContent = favArray[iOfFav].explanation;
    $chosenDate.style.display = "grid";
    $apiFullSize.src = favArray[iOfFav].hdlink;
}

function buildList() {
    let $favList = [];
    if(favArray.length > 0) {
    let i = 1;
    for(const eachFav of favArray) {
        $favList.push(`
        <div class="favItem" id="favId${i}">
            <img src="${eachFav.link}" alt="" class="favPicture" id="favPic${i}">
            <h3 class="favTitle" id="favTit${i}">${eachFav.title}</h3>
            <h4 class="favDate">${eachFav.date}</h4>
            <button class="favDel" id="favBtnId${i}">Delete</button>
        </div>
        `);
        i++
    } ;
    }; 
    $favourites.innerHTML = $favList.join("");
    $favourites.style.display = "grid";
    let $deleteButtons = document.querySelectorAll(".favDel");

    for (const $button of $deleteButtons) {
        $button.addEventListener('click', deleteFav)
    };

    let favTitles = document.querySelectorAll(".favTitle");
    let favPictures = document.querySelectorAll(".favPicture");

    for (const goBig of favPictures) {
        goBig.addEventListener('click', goBackToFavorite)
    };
    
    for (const thisTitle of favTitles) {
        thisTitle.addEventListener('click', goBackToFavorite)
    };
};

buildList();

const displayData = apiData => {
  $apiTitle.textContent = apiData.title;
  $apiDate.textContent = apiData.date;
  if (apiData.media_type == "image") {
  $apiPic.src = apiData.url;
  $apiFullSize.src = apiData.hdurl;
    } else {
        $apiPic.src = "https://www.fillmurray.com/640/360";
        $apiFullSize.src = "https://www.fillmurray.com/640/360";
    };
  $apiAbout.textContent = apiData.explanation;
  $chosenDate.style.display = "grid";
  
};

$getPic.addEventListener ('click', function(e) {
    e.preventDefault();
    fetchNASAData();
});

$addFav.addEventListener ('click', function(e) {
    e.preventDefault();
    const pushData = new Object();
    pushData.title = $apiTitle.textContent;
    pushData.date = $apiDate.textContent;
    pushData.link = $apiPic.src;
    pushData.explanation = $apiAbout.textContent;
    pushData.hdlink = $apiFullSize.src;
    favArray.push(pushData);
    const stringArray = JSON.stringify(favArray);
    localStorage.setItem('arrayData', stringArray);
    buildList();
});

$apiPic.addEventListener('click', function(e) {
    e.preventDefault();
    $fullPic.style.display = "flex";
});

$fullPic.addEventListener('click', function(e) {
    e.preventDefault();
    $fullPic.style.display = "none";
});