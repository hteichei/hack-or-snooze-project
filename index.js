var user_name;
var list = $('#storyList');
let count = 0;
let stories = [];

$(function() {
  $.getJSON('https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=10')
    .then(function(data) {
      // data.data.forEach(function(name) {
      //   list.append(`<li>${name.title} (${name.url})</li>`);
      //   // console.log(name.title);
      // });
      stories = data.data;
      displayTenStories(stories);
    })
    .catch(function(error) {
      console.log(error);
    });
});

function displayTenStories(d) {
  d.forEach(function(name) {
    list.append(`<li>${name.title} (${name.url})</li>`);
    // console.log(name.title);
  });
}

$('#loginLink').on('click', function() {
  $('#signUpForm').hide();
  $('#loginForm').slideToggle();
});

$('#signUpLink').on('click', function() {
  $('#loginForm').hide();
  $('#signUpForm').slideToggle();
});

$('#submitBtn').on('click', function() {
  $('#submitForm').slideToggle();
});

function logIn(event) {
  event.preventDefault();
  let user_name = $('#login_username').val();
  let data = {
    data: {
      username: $('#login_username').val(),
      password: $('#login_password').val()
    }
  };

  $.post('https://hack-or-snooze.herokuapp.com/auth', data, 'json')
    .then(function(msg) {
      localStorage.setItem('token', msg.data.token);
      localStorage.setItem('username', user_name);
      $('#loginForm').slideToggle();
      $('#loginForm > form')[0].reset();
      $('#loginLink').hide();
      $('#signUpLink').hide();
      console.log(msg);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function submit(event) {
  event.preventDefault();
  let title = $('#submit_title').val();
  let url = $('#submit_url').val();
  let author = $('#submit_author').val();
  let data = {
    data: {
      author: author,

      title: title,

      url: url,

      username: localStorage.getItem('username')
    }
  };

  let token = localStorage.getItem('token');

  $.ajax({
    url: 'https://hack-or-snooze.herokuapp.com/stories',
    method: 'POST',
    dataType: 'json',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: JSON.stringify(data)
  })
    .then(function(msg) {
      list.append(`<li>${title} (${url})</li>`);

      $('#submitForm > form')[0].reset();

      console.log(msg);
    })
    .catch(function(error) {
      console.log(error);
    });
}

$('#loginForm').submit(logIn);
$('#submitForm').submit(submit);
