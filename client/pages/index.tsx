import React from "react";
import {useSelector} from "react-redux";
import {selectAuthUser} from "@/store/slices/authSlice";
import AuthForm from "@/components/Forms/Auth";
import MessagesContainer from '@/components/Containers/Messages';

/**
 * The Messages Container Page.
 *
 * @constructor
 */
export default function Main() {
  const authUser = useSelector(selectAuthUser)

  // Render
  return(
    <div>
      {
        authUser === null
          ? <AuthForm/>
          : <MessagesContainer/>
      }
    </div>
  )
}
