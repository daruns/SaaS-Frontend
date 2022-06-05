class Auth extends EventTarget {
    constructor({ apiKey, clientId }) {
      super();
  
      this.apiKey = apiKey;
      this.clientId = clientId;
    }
  
    init() {
      return new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: this.apiKey,
              clientId: this.clientId,
              // List of discovery docs that we'll use on our application.
              // On this example we're using Google Drive API.
              // discoveryDocs: [
              //   'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
              // ],
              // The scopes we're using separated by space.
              // https://developers.google.com/identity/protocols/oauth2/scopes
              scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
            });

            window.gapi.auth2
              .getAuthInstance()
              .isSignedIn.listen(status =>
                status
                  ? this.dispatchEvent(new Event('loggedIn'))
                  : this.dispatchEvent(new Event('loggedOut'))
              );
  
            resolve(window.gapi);
          } catch (error) {
            console.log("error occured in wndow gapi: ", error)
            reject(new Error(error.error.message));
          }
        });
      });
    }
  }
  
  export default Auth;
  