class App {
  constructor(firebase) {
    this.firebase = firebase;
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();
    // Initiates Firebase auth and listen to auth state changes.
    // this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));

    this.signInButton = document.getElementById('sign-in')
    this.signInButton.addEventListener("click", this.signIn.bind(this));
  }

  signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
  }
}

window.onload = () => {
  window.app = new App();
};
