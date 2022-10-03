/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const response = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${query}`
  );
  const data = response.data;
  const objArr = [];
  for (let show of data) {
    ({
      show: { id, name, summary, image },
    } = show);
    objArr.push({ id, name, summary, image });
  }
  console.log(objArr);
  return objArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
              <img class="card-img-top" src="${
                show.image.medium
                  ? show.image.medium
                  : "https://tinyurl.com/tv-missing"
              }">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="btn-primary">Episodes</button>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

$("#shows-list").on("click", "button", async function (e) {
  const showID = e.target.parentElement.getAttribute("data-show-id");
  const episodes = await getEpisodes(showID);
  console.log(episodes);
  populateEpisodes(episodes);
});

async function getEpisodes(id) {
  console.log(id);
  const response = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );
  const episodeArr = [];
  const data = response.data;
  console.log(data);
  for (let episode of data) {
    ({ id, name, season, number } = episode);
    episodeArr.push({ id, name, season, number });
  }
  return episodeArr;
}

function populateEpisodes(episodes) {
  const $episodeArea = $("#episodes-area");
  const $episodeList = $("#episodes-list");
  $episodeArea.show();
  $episodeList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name}(season: ${episode.season}, episode: ${episode.number}</li>`
    );
    $episodeList.append($item);
  }
}
