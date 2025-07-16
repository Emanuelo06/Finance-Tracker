"use client"
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { setUser, setLoading } from "@/redux/slices/authSlice"
import { RootState } from "@/redux/store"
import Image from "next/image";

import Link from "next/link"
import { signInWithFacebook, signInWithGitHub, signInWithGoogle, signInWithTwitter } from "@/lib/firebaseAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})
  const dispatch = useDispatch()
  const router = useRouter();

const handleGoogleLogin = async () => {
  await signInWithGoogle();
  router.push("/dashboard");
};
const handleFacebookLogin = async () => {
  await signInWithFacebook();
  router.push("/dashboard");
};
const handleTwitterLogin = async () => {
  await signInWithTwitter();
  router.push("/dashboard");
};
const handleGitHubLogin = async () => {
  await signInWithGitHub();
  router.push("/dashboard");
};
const { loading } = useSelector((state: RootState) => state.auth)
const [firebaseError, setFirebaseError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) errors.email = "Email is required"
    if (!password.trim()) errors.password = "Password is required"

    setFormErrors(errors)

    if (Object.keys(errors).length > 0) return

    dispatch(setLoading(true))
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      dispatch(setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || "",
        name: userCredential.user.displayName || undefined,
        photoURL: userCredential.user.photoURL || undefined,
      }))
      router.push("/dashboard")
    } catch (err: any) {
      console.error(err);
      // Firebase error code for existing account: auth/email-already-in-use
      if (err.code === "auth/email-already-in-use") {
        setFirebaseError("Account already exists, try logging in.");
      } else {
        setFirebaseError(err.message);
      }
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="pt-5 p-3 bg-gradient-to-b from-[#225B97] to-[#72D5FF] min-h-screen w-full md:w-1/2">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-semibold text-center">Sign Up</h1>
        <p className="text-center mt-2 text-white text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">With Email</p>

        <form className="mt-6 sm:px-4 md:px-10 flex flex-col items-center" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <label className="text-xs xs:text-sm sm:text-base md:text-lg text-white block mb-1 self-start">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`text-xs xs:text-sm sm:text-base md:text-lg py-2 w-full bg-[#D9D9D9] rounded-3xl pl-3 focus:outline-none ${
              formErrors.email ? "border border-red-500" : ""
            }`}
          />
          {formErrors.email && (
            <p className="text-red-200 text-xs xs:text-sm sm:text-base  mt-1 self-start">{formErrors.email}</p>
          )}

          {/* Password Field */}
          <label className="text-xs xs:text-sm sm:text-base md:text-lg text-white block mt-4 mb-1 self-start">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`text-xs xs:text-sm sm:text-base md:text-lg py-2 w-full bg-[#D9D9D9] rounded-3xl pl-3 focus:outline-none ${
              formErrors.password ? "border border-red-500" : ""
            }`}
          />
          {formErrors.password && (
            <p className="text-red-200 text-xs xs:text-sm sm:text-base md:text-lg mt-1 self-start">{formErrors.password}</p>
          )}

          {/* Firebase error */}
          {firebaseError && <p className="text-red-200 text-xs xs:text-sm sm:text-base md:text-lg mt-1.5 self-start">{firebaseError}</p>}

          <button
            type="submit"
            className="mt-6 bg-[#14026F] cursor-pointer text-white text-xs xs:text-sm sm:text-base md:text-lg font-bold w-[50%] max-w-[200px] py-2.5 rounded-3xl"
            disabled={loading}
          >
            <p>Sign Up</p>
          </button>
          <div className="w-[80%] h-[1px] my-3 bg-white"></div>
          <p className="text-white text-xs xs:text-sm sm:text-base md:text-lg">Or With</p>
          
        </form>
        <div className="flex justify-between items-center w-full mt-3 px-3 sm:px-10 sm:mb-5">
            <button onClick={()=> handleGitHubLogin()} className="text-white underline text-2xl sm:text-4xl md:text-5xl "><FaGithub/></button>
            <button onClick={()=> handleGoogleLogin()} className="text-white underline text-2xl sm:text-4xl md:text-5xl  ml-4"><FaGoogle /></button>
            <button onClick={()=> handleFacebookLogin()} className="text-white underline text-2xl sm:text-4xl md:text-5xl ml-4"><FaFacebook/></button>
            <button onClick={()=> handleTwitterLogin()} className="text-white underline text-2xl sm:text-4xl md:text-5xl  ml-4"><FaXTwitter /></button>
          </div>

        <div className="flex justify-center w-full mt-3">
          <Link href="/" className="text-xs sm:text-base text-white underline">Don't have an account? Log In</Link>
        </div>
        
      </div>
      <div className="relative w-full sm:w-1/2 h-[300px] md:h-screen items-center justify-center hidden md:flex">
        <Image 
          src="/login_img.jpeg" 
          alt="Login illustration" 
          fill
          className="object-cover"
          sizes="(min-width: 640px) 50vw, 100vw"
          priority
        />
      </div>
    </div>
  )
}
