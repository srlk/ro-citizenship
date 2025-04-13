let data = [];
let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;

function convertMarkdownToHtml(text) {
  return text
    // Convert bold (**text**)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert italics (*text*)
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert bullet points
    .replace(/^\s*[-*+]\s+(.*)$/gm, '<li>$1</li>')
    // Convert numbered lists
    .replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>')
    // Convert headers
    .replace(/^#{1,6}\s+(.*)$/gm, function(match, text) {
      const level = match.trim().indexOf(' ');
      return `<h${level}>${text}</h${level}>`;
    });
}

function renderQuestion(index) {
  const item = data[index];
  $("#question_ro").html(convertMarkdownToHtml(item.question_ro));
  $("#question_en").html(convertMarkdownToHtml(item.question_en));
  $("#answer_ro").html(convertMarkdownToHtml(item.answer_ro));
  $("#answer_en").html(convertMarkdownToHtml(item.answer_en));

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
  localStorage.setItem('currentIndex', currentIndex);
  renderQuestion(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % data.length;
  localStorage.setItem('currentIndex', currentIndex);
  renderQuestion(currentIndex);
}

function showRandom() {
  let randIndex;
  do {
    randIndex = Math.floor(Math.random() * data.length);
  } while (randIndex === currentIndex);
  currentIndex = randIndex;
  localStorage.setItem('currentIndex', currentIndex);
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
