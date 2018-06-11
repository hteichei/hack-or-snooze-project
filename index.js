$(document).ready(function() {
  checkIfLoggedIn();
  appendUserData();
  toggleStoryList();
  $('#loginForm').submit(logIn);
  $('#submitForm').submit(submit);
  $('#signUpForm').submit(signUp);
  fetchUserStories();
  handleFavorites();

  $(function() {
    let list = $('#storyList');
    $.getJSON('https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=11')
      .then(function(data) {
        stories = data.data;
        data.data.forEach(function(name) {
          list.append(
            `<li class='storyListElement'><i id=${
              name.storyId
            } class="far fa-star"></i><a href=${name.url}<li>${
              name.title
              /* extract host from URL. Credit: https://stackoverflow.com/a/8498629 */
            } </a><span class='hostName'>(${name.url
              .match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i)[1]
              .replace('www.', '')})</span></li></li>`
          );
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  function handleFavorites() {
    $('#storyList').on('click', 'i', function(event) {
      // event.preventDefault();
      let userName = localStorage.getItem('username');
      let token = localStorage.getItem('token');
      let storyId = $(event.target).attr('id');
      let parent = $(event.target)
        .parent()
        .clone();
      $(event.target).toggleClass('fas fa-star far fa-star');
      if ($(event.target).hasClass('fas')) {
        console.log(storyId);
        $.ajax({
          url: `https://hack-or-snooze.herokuapp.com/users/${userName}/favorites/${storyId}`,
          method: 'POST',
          dataType: 'json',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
          .then(function(response) {
            console.log(response);
            $('#favoritesList').append($(parent));
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        $.ajax({
          url: `https://hack-or-snooze.herokuapp.com/users/${userName}/favorites/${storyId}`,
          method: 'DELETE',
          dataType: 'json',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    });
  }

  function checkIfLoggedIn() {
    if (
      localStorage.token !== undefined &&
      localStorage.username !== undefined
    ) {
      $('#signUpLink').hide();
      $('#loginLink').text('Logout');
      $('#loginLink').click(logMeOut);
    }
  }

  $('#loginLink').on('click', function() {
    $('#signUpForm').hide();
    $('#loginForm').slideToggle();
  });

  $('#signUpLink').on('click', function() {
    $('#loginForm').hide();
    $('#signUpForm').slideToggle();
  });

  $('#favoritesLink').on('click', function() {
    $('#favoritesContainer').slideToggle();
  });

  $('#submitBtn').on('click', function() {
    $('#submitForm').slideToggle();
  });

  $('#userProfile').on('click', function() {
    $('#userProfileForm').slideToggle();
    $('#userProfileForm').toggleClass('harry');
    let userName = localStorage.getItem('username');
    let name = localStorage.getItem('name');
    $('#spotForName').text(`${name}`);
    $('#spotForUserName').text(`${userName}`);
  });

  function toggleStoryList() {
    if ($('#userProfileForm').hasClass('harry')) {
      $('#storyListContainer').hide();
    } else {
      $('#storyListContainer').show();
    }
  }

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
        console.log(msg);
        localStorage.setItem('token', msg.data.token);
        localStorage.setItem('username', user_name);
        $('#loginForm').slideToggle();
        $('#loginForm > form')[0].reset();
        $('#loginLink').text('Logout');
        $('#loginLink').click(logMeOut);
        $('#signUpLink').hide();
        window.location.reload();
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function logMeOut() {
    localStorage.clear();
    $('#spotForName').text('');
    $('#spotForUserName').text('');
    $('#myStoriesList').empty();
    $('#userProfileForm').hide();
    $('#loginLink').text('Login');
    $('#signUpLink').show();
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
        window.location.reload();
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function signUp() {
    // event.preventDefault();
    let signup_name = $('#signup_username').val();
    let full_name = $('#signup_name').val();
    let data = {
      data: {
        name: full_name,
        username: $('#signup_username').val(),
        password: $('#signup_password').val()
      }
    };
    $.post('https://hack-or-snooze.herokuapp.com/users', data, 'json')
      .then(function(msg) {
        localStorage.setItem('username', signup_name);
        localStorage.setItem('name', full_name);
        $('#signUpForm').slideToggle();
        $('#signUpForm > form')[0].reset();
        $('#signUpLink').hide();
        console.log(msg);
      })
      .catch(function(error) {
        console.log(error);
      });
    alert('Please proceed to Login to confirm credentials!');
  }

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
        localStorage.setItem('name', response.data.name);
        response.data.stories.forEach(function(story) {
          $('#myStoriesList').append(
            `<li><a href=${story.url} target='blank'>${story.title}</a></li>`
          );
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  //append user information to the userData section of userProfile
  function appendUserData() {
    let userName = localStorage.getItem('username');
    let name = localStorage.getItem('name');
    $('#spotForName').text(`${name}`);
    $('#spotForUserName').text(`${userName}`);
  }
});
