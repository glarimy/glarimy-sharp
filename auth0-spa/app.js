window.addEventListener('load', function() {
  document.getElementById('loginBtn').addEventListener('click', function(){
    webAuth.authorize();
  });

  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid',
    leeway: 60
  });

  webAuth.parseHash(function(err, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      let id = authResult.idTokenPayload.sub;
      document.getElementById('loginBtn').style.display = 'none';
      let xhr = new XMLHttpRequest();
      xhr.open('get', 'http://localhost:8081/api/fetch/'+id, true);
      xhr.setRequestHeader('Authorization', "Bearer " + authResult.idToken);
      xhr.onreadystatechange = function(){
        if(xhr.status == 200 && xhr.readyState == 4){
          let profile = JSON.parse(JSON.parse(xhr.responseText));
          console.log(profile);
          let html = `Hi ${profile.name}!<br/>
          Your Access Token from IDP:<br/>
          ${profile.identities[0].access_token}`;
          document.getElementById('profile').innerHTML = html;
        }
      }
      xhr.send();
    }else
      document.getElementById('loginBtn').style.display = 'block';
  });
});
