import axios, {AxiosError} from "axios";
import {createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "@/store";
import {User} from "@/types";
import {clearMessages, fetchMessages} from "@/store/slices/messagesSlice";
import Swal from "sweetalert2";

// TODO: For the routing use the global env

// The TypeScript type for auth state
type AuthState = {
  user: User
}

/**
 * Fetch the validated user if exists.
 */
export function fetchValidatedUser()
{
  return (dispatch: Dispatch) =>
  {
    // Axios Request
    axios.get<User>('/api/auth')
      .then((res) =>
      {
        // Validate the user
        dispatch(validate(res.data))

        // Fetch all the user messages
        fetchMessages()(dispatch)
      })
      .catch((err: AxiosError) =>
      {
        // Error Message for when there's unexpected error beside lack of authentication
        if (err.response && err.response.status != 401 ) {
          Swal.fire(
            'Failed!',
            'There was a problem with the user verification process.',
            'error'
          )
        }
      })
  }
}

/**
 * Log out the current user.
 */
export function logoutUser()
{
  return (dispatch: Dispatch) =>
  {
    // Logout the user in the server
    axios.post<null>('/api/auth/logout').catch((err) => err )

    // Invalidate the user auth in client without waiting for response
    dispatch(invalidate())

    // Clear all the messages
    fetchMessages()(dispatch)
  }
}

// The Auth Redux Slice
const authSlice = createSlice({
  name: 'authenticated',
  initialState: {
    user: null
  } as AuthState,
  reducers: {
    /**
     * Reducer for setting the validated user.
     *
     * @param state
     * @param payload
     */
    validate: function(state: AuthState, {payload}: PayloadAction<User>) {
      state.user = payload
    },

    /**
     * Reducer for invalidating the auth user.
     *
     * @param state
     */
    invalidate: function(state: AuthState) {
      state.user = null

    }
  }
})

// State Exports
export const selectAuthUser = (state: RootState) => state.auth.user

// Action Exports
export const { validate, invalidate } = authSlice.actions

// Reducer Exports
export default authSlice.reducer
