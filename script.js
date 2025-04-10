let data = [];
let currentIndex = 0;

function renderQuestion(index) {
  const item = data[index];
  $("#question_ro").text(item.question_ro);
  $("#question_en").text(item.question_en);
  $("#answer_ro").text(item.answer_ro);
  $("#answer_en").text(item.answer_en);

  const imageContainer = $("#image_container");
  imageContainer.empty();

  if (item.images && item.images.length > 0) {
    item.images.forEach(src => {
      imageContainer.append(`<img src="${src}" alt="image">`);
    });
  }
}

function showPrevious() {
  currentIndex = (currentIndex - 1 + data.length) % data.length;
  renderQuestion(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % data.length;
  renderQuestion(currentIndex);
}

function showRandom() {
  let randIndex;
  do {
    randIndex = Math.floor(Math.random() * data.length);
  } while (randIndex === currentIndex);
  currentIndex = randIndex;
  renderQuestion(currentIndex);
}

$(document).ready(function () {
  $.getJSON("db.json", function (jsonData) {
    data = jsonData.questions;
    renderQuestion(currentIndex);

    $("#prevBtn").click(showPrevious);
    $("#nextBtn").click(showNext);
    $("#randomBtn").click(showRandom);
  }).fail(function () {
    alert("Failed to load data from db.json");
  });
});
