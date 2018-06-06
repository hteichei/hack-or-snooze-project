$(function() {
  var list = $('#storyList');
  $.getJSON('https://hack-or-snooze.herokuapp.com/stories')
    .then(function(data) {
      data.data.forEach(function(name) {
        list.append(`<li>${name.title} (${name.url})</li>`);
        console.log(name.title);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

$('#loginLink').on('click', function() {
  $('#signUpForm').hide();
  $('#loginForm').slideToggle();
});

$('#signUpLink').on('click', function() {
  $('#loginForm').hide();
  $('#signUpForm').slideToggle();
});
