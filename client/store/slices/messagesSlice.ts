import {createSlice, PayloadAction, Dispatch} from '@reduxjs/toolkit'
import {Message, MessageListingTypes} from '@/types'
import {RootState} from "@/store";
import Swal from "sweetalert2";
import axios from "axios";
import _ from "lodash"

// TODO: For the routing use the global env

// The TypeScript type for message actions
type MessageAction = {
  message: Message,
  listingType: MessageListingTypes
}

// The TypeScript type for messages state
type MessagesState = {
  inbox: Array<Message>
  outbox: Array<Message>
}

/**
 * Fetch the messages from the server.
 */
export function fetchMessages()
{
  return (dispatch) =>
  {
    // Axios Request
    axios.get<MessagesState>('/api/resources/messages')
      .then((res) =>
      {
        dispatch(set(res.data))
      })
      .catch((err) =>
      {
        // Error Message
        Swal.fire(
          'Failed!',
          'There was a problem with fetching the messages from the server.',
          'error'
        )
      })
  }
}

/**
 * Message deletion.
 *
 * @param payload
 */
export function deleteMessage(payload: MessageAction)
{
  return (dispatch: Dispatch) =>
  {
    // The deletion api call to be used in the message confirmation
    const deletionRequest = () => {
      return axios.delete<Message>(`/api/resources/messages/${payload.message.id}`, {
        params: {
          listing_type: payload.listingType
        }
      })
        .then((res) => {
          dispatch(remove(payload))
        })
        .catch(() =>
        {
          // Error Message
          Swal.fire(
            'Failed!',
            'There has been a problem deleting your message.',
            'error'
          )
        })
    }

    // Confirmation for message deletion
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      preConfirm: deletionRequest
    }).then((result) =>
    {
      // Success Message
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your message has been deleted successfully.',
          'success'
        )
      }
    })
  }
}

/**
 * Clear all the user messages form the state.
 */
export function clearMessages()
{
  return (dispatch: Dispatch) => {
    dispatch(set({
      inbox: [],
      outbox: []
    }))
  }
}

// The Messages Redux Slice
const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    inbox: new Array<Message>(),
    outbox: new Array<Message>(),
  } as MessagesState,
  reducers: {
    /**
     * Reducer for setting the state of the messages.
     *
     * @param state
     * @param inbox
     * @param outbox
     */
    set: function (state: MessagesState, {payload: {inbox, outbox}}: PayloadAction<MessagesState>) {
      state.inbox = inbox
      state.outbox = outbox
    },

    /**
     * Reducer for adding messages.
     *
     * @param state
     * @param message
     * @param listingType
     */
    add: function (state: MessagesState, {payload:{ message, listingType }}: PayloadAction<MessageAction>)
    {
      state[listingType] = state[listingType].concat(message)
    },

    /**
     * Reducer for removing messages.
     *
     * @param state
     * @param message
     * @param listingType
     */
    remove: function (state: MessagesState, { payload:{ message, listingType }}: PayloadAction<MessageAction>) {
      state[listingType] = _.filter(
        state[listingType], (messageCompare: Message) => messageCompare.id != message.id
      )
    }
  }
})

// State Exports
export const selectInbox = (state: RootState) => state.messages.inbox
export const selectOutbox = (state: RootState) => state.messages.outbox

// Action Exports
export const { set, add, remove } = messagesSlice.actions

// Reducer Exports
export default messagesSlice.reducer
