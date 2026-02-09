import { useSelector } from "react-redux";
import { selectUser } from "./currentUser.selector";
import { useState } from "react";

export const handleShowUserProfile=(id:number)=>{
    //const [showUserProfile,setShowUserProfile]=useState(false);
    if(id!=0)
      return true;
    return false
  }; 