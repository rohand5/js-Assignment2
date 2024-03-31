const albumSearchForm = document.getElementById("album-search-form");
const searchInputRef = document.getElementById("search-input");
const minAlbumRatingInputRef = document.getElementById(
  "min-album-rating-input"
);
const allAlbumsList = document.getElementById("album-rows");
const averageRatingHeaderRef = document.getElementById("average-rating");
const reviewsRatingHeaderRef = document.getElementById("reviews-rating");
const releaseDateHeaderRef = document.getElementById("release-date");
const noData = document.getElementById("zero-records");

async function getAlbums() {
  const res = await fetch("public/data/albums.json");
  const data = await res.json();
  return data;
}

function onSearchSubmit(e) {
  e.preventDefault();
  e.stopPropagation();
  const searchInput = searchInputRef.value.trim().toLowerCase();

  let minAlbumRatingInput = 0;

  if (minAlbumRatingInputRef.value.trim().length > 0)
    minAlbumRatingInput = parseFloat(minAlbumRatingInputRef.value.trim());

  if (searchInput.length !== 0 || minAlbumRatingInput.length !== 0) {
    const newFilterList = albumStore.filter(function (album) {
      return (
        (album.album.toLowerCase().includes(searchInput) ||
          album.artistName.toLowerCase().includes(searchInput)) &&
        album.averageRating >= minAlbumRatingInput
      );
    });

    addAlbumToDOM(newFilterList);
    
    if (newFilterList.length > 0) {
      noData.classList.add("no-data");
    } else {
      noData.classList.remove("no-data");
    }
  }
}

function compareByAverageRating(a, b) {
  if (a.averageRating < b.averageRating) {
    return 1;
  }
  if (a.averageRating > b.averageRating) {
    return -1;
  }
  return 0;
}

function compareByReviewsRating(a, b) {
  if (a.numberReviews < b.numberReviews) {
    return 1;
  }
  if (a.numberReviews > b.numberReviews) {
    return -1;
  }
  return 0;
}

function compareByReleaseDate(a, b) {
  if (Date.parse(a.releaseDate) < Date.parse(b.releaseDate)) {
    return 1;
  }
  if (Date.parse(a.releaseDate) > Date.parse(b.releaseDate)) {
    return -1;
  }
  return 0;
}

function sortByAverageRating() {
  albumStore.sort(compareByAverageRating);
  addAlbumToDOM(albumStore);
}

function sortByReviewsRating() {
  albumStore.sort(compareByReviewsRating);
  addAlbumToDOM(albumStore);
}

function sortByReleaseDate() {
  albumStore.sort(compareByReleaseDate);
  addAlbumToDOM(albumStore);
}

function addAlbumToDOM(albumsJson) {
  allAlbumsList.innerHTML = "";
  albumsJson.forEach((album) => {
    const newAlbum = document.createElement("tr");
    newAlbum.innerHTML = `                                            
      <td>${album.album}</td>
      <td>${album.releaseDate}</td>
      <td>${album.artistName}</td>
      <td>${album.genres}</td>
      <td>${album.averageRating}</td>
      <td>${album.numberReviews}</td>
    `;
    allAlbumsList.appendChild(newAlbum);
  });
}

const albumStore = await getAlbums().catch((error) => console.log(error));
addAlbumToDOM(albumStore);

// Initialize app
function init() {
  // Event Listeners
  albumSearchForm.addEventListener("submit", onSearchSubmit);
  averageRatingHeaderRef.addEventListener("click", sortByAverageRating);
  reviewsRatingHeaderRef.addEventListener("click", sortByReviewsRating);
  releaseDateHeaderRef.addEventListener("click", sortByReleaseDate);
}

init();
