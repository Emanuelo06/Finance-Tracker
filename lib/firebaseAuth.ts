
import { GithubAuthProvider, TwitterAuthProvider, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";


export { auth };


export const signInWithGitHub = async () => {
   const provider = new GithubAuthProvider();
   await signInWithPopup(auth, provider);

}

export const signInWithGoogle = async () => {
   const provider = new GoogleAuthProvider();
   await signInWithPopup(auth, provider);

}
export const signInWithFacebook = async () => {
   const provider = new FacebookAuthProvider();
   await signInWithPopup(auth, provider);
  
}
export const signInWithTwitter = async () => {
   const provider = new TwitterAuthProvider();
   await signInWithPopup(auth, provider);

}