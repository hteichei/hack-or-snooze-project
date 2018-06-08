$(document).ready(function() {
  var user_name;
  var list = $('#storyList');
  let count = 0;
  let stories = [];

  $(function() {
    $.getJSON('https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=10')
      .then(function(data) {
        stories = data.data;
        data.data.forEach(function(name) {
          list.append(
            `<li><i class="far fa-star"></i><a href=${name.url}<li>${
              name.title
            } </a><span class='hostName'>(${name.url
              .split('/')[2]
              .split('.')[1] + '.com'})</span></li></li>`
          );
          // console.log(name.title);
        });
        // displayTenStories(stories);
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  $('#storyList').on('click', 'i', function(event) {
    $(event.target).toggleClass('fas fa-star far fa-star');
  });

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
        $('#loginLink').text('Logout');
        $('#loginLink').click(logMeOut);
        $('#signUpLink').hide();
        console.log(msg);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function logMeOut() {
    debugger;
    localStorage.clear();
    '#loginLink'.text('Login');
    '#signUpLink'.show();
    //trying to remove toggle functionality from logOutLink NOT WORKING
    $('#logInForm').css('display', 'none');
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
  $('#signUpForm').submit(signUp);

  //everything from here down needs to be refactored

  function signUp(event) {
    event.preventDefault();
    let signup_name = $('#signup_username').val();
    let data = {
      data: {
        name: $('#signup_name').val(),
        username: $('#signup_username').val(),
        password: $('#signup_password').val()
      }
    };
    $.post('https://hack-or-snooze.herokuapp.com/users', data, 'json')
      .then(function(msg) {
        localStorage.setItem('username', signup_name);
        $('#signUpForm').slideToggle();
        $('#signUpForm > form')[0].reset();
        $('#loginLink').hide();
        $('#signUpLink').hide();
        console.log(msg);
      })
      .catch(function(error) {
        console.log(error);
      });
    signUpLogIn();
  }

  //modified logIn function used to call function in the signup function
  function signUpLogIn() {
    let user_name = $('#login_username').val();
    let data = {
      data: {
        username: $('#signup_username').val(),
        password: $('#signup_password').val()
      }
    };
    $.post('https://hack-or-snooze.herokuapp.com/auth', data, 'json')
      .then(function(msg) {
        localStorage.setItem('token', msg.data.token);
        console.log(msg);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
});

//Get stories posted by user for the user profile
function fetchUserStories() {
  let userName = localStorage.getItem('username');
  let token = localStorage.getItem('token');
  $.ajax({
    url: `https://hack-or-snooze.herokuapp.com/users/${userName}`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(function(response) {
      console.log(response);
      response.data.stories.forEach(function(story) {
        console.log(story.title);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}

fetchUserStories();
