// SUCESS POPUP WINDOWS

// FACEBOOK

module.exports.facebookSuccess = user => {
  return `
 <!DOCTYPE html>
<html lang="en">
  <head>
  <script>window.opener.successCallback(${user}); window.close()</script>
  </head>
  <body>
  Successfully logged in...
  </body>
</html>
`;
};
