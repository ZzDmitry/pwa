/* eslint-disable comma-dangle */
/* global $ */

$(() => {
  const API_PATH = '@@CONFIG.APP_URL';
  const LS_TOKEN_KEY = 'token-pwa2';

  $('#login-form').hide();
  $('#userinfo-form').hide();

  function showLogin() {
    $('#login-form').show();
    $('#userinfo-form').hide();
    $('#login-result .error-message').hide();
  }

  function showUserInfo() {
    $('#login-form').hide();
    $('#userinfo-form').show();
  }

  function showUserInfoOrLogin() {
    $.ajax({
      url: `${API_PATH}userinfo`,
      data: {
        token: localStorage.getItem(LS_TOKEN_KEY),
      },
      success(userInfo) {
        showUserInfo();
        const userHomePageUrl = userInfo.homePageUrl;
        const $userHomePage = $('#user-home-page');
        $userHomePage.toggle(!!userHomePageUrl);
        if (userHomePageUrl) {
          $userHomePage.attr('href', userHomePageUrl);
        }
      },
      error() {
        showLogin();
      },
    });
  }

  $('#login-button').click((evt) => {
    evt.preventDefault();
    $.ajax({
      url: `${API_PATH}login`,
      data: {
        login: $('#login-input').val(),
        password: $('#password-input').val(),
      },
      success(token) {
        $('#login-result .error-message').hide();
        localStorage.setItem(LS_TOKEN_KEY, token);
        showUserInfoOrLogin();
      },
      error(res) {
        $('#login-result .error-message').hide();
        if (res.status === 404) {
          $('#login-result .not-registered').show();
          return;
        }
        if (res.status === 401) {
          $('#login-result .wrong-password').show();
          return;
        }
        $('#login-result .unknown-error').show();
      },
    });
  });

  $('#logout-button').click((evt) => {
    evt.preventDefault();
    localStorage.setItem(LS_TOKEN_KEY, '');
    showLogin();
  });

  showUserInfoOrLogin();

  $('#update-available-reload').click(() => {
    window.location.reload();
  });
});

navigator.serviceWorker.addEventListener(
  'message',
  (event) => {
    if (event.data === 'reload-page') {
      $('#update-available-reload').show();
    }
  }
);
