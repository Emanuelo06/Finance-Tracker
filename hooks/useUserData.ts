import {useEffect, useState} from "react"
import {doc, getDoc} from "firebase/firestore"
import { useAppSelector } from "@/lib/hooks"
import { db } from "@/lib/firebase" 
import Router, { useRouter } from "next/router"
import { redirect } from "next/dist/server/api-utils"

export const useUserData = ()=> {
   const user = useAppSelector((state) => state.auth.user)
   const [userData, setUserData] = useState<any>(null)
   const [loading, setLoading] = useState(false)
   const router = useRouter()
   useEffect(()=> {
      if(!user){
         setUserData(null)
         router.push("/")
         return
      }
      
      const fetchUserData = async ()=> {
         const docRef = doc(db, "users", user.uid)
         const docSnap = await getDoc(docRef)

         if(docSnap.exists()){
            setUserData(docSnap.data())
         }
         setLoading(false)
      }
      fetchUserData()
   },[user])

   return {userData, loading}
}