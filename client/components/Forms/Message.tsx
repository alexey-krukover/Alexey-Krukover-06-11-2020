import {
  Button,
  Card,
  CardContent,
  Box,
  TextField,
  Grid,
  Divider,
  CircularProgress
} from "@material-ui/core"
import React, {useState} from "react"
import axios, {AxiosError} from "axios"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPortalEnter, faPortalExit} from '@fortawesome/pro-solid-svg-icons'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import {OptionTypeBase, StylesConfig} from "react-select"
import {Message, MessageListingTypes, User} from "@/types"
import {useDispatch} from "react-redux"
import {add} from "@/store/slices/messagesSlice"
import Swal from 'sweetalert2'
import * as yup from "yup"
import {makeStyles} from "@material-ui/core/styles";

// Form Validation Schema
const validationSchema = yup.object().shape({
  sender_id: yup.number().required(),
  receiver_id: yup.number().required(),
  subject: yup.string().required(),
  message: yup.string().required(),
})

// Form Styling
const useStyles = makeStyles(() => ({
  userFieldPrefix: {
    height: 38
  }
}))

/**
 * The Message Form component.
 *
 * @constructor
 */
export default function MessageForm()
{
  // Misc Hooks
  const classes = useStyles()
  const dispatch = useDispatch()
  const {control, register, errors, handleSubmit, reset} = useForm({
    resolver: yupResolver(validationSchema)
  })

  // Component State Hooks
  const [loading, setLoading] = useState<boolean>(false)

  // The custom React Select styling for the sender field
  const customSenderSelectStyles: StylesConfig = {
    control: (base) => {
      if (!!errors.sender_id) {
        base.borderColor = "red"
      }

      return base
    }
  }

  // The custom React Select styling for the recipient field
  const customReceiverSelectStyles: StylesConfig = {
    control: (base) => {
      if (!!errors.receiver_id) {
        base.borderColor = "red"
      }

      return base
    }
  }

  /**
   * Server request to search and fetch users.
   *
   * @params inputValue
   * @params callback
   */
  const findUsers = (inputValue: string, callback) =>
  {
    // Axios Request
    axios.get<User[]>(`/api/resources/users?q=${inputValue}`)
      .then((res) =>
      {
        // Map the result from the server to match the expect properties for react-select
        callback(res.data.map((value: User) => ({
          label: value.username,
          value: value.id
        })))
      })
      .catch((err: AxiosError) =>
      {
        // Error Message
        Swal.fire(
          'Failed!',
          'There was a problem with fetching the list of users',
          'error'
        )

        // In exception retunr an empty list as to empty the options
        callback([])
      })
  }

  /**
   * Handle the message submitions.
   *
   * @params data
   */
  const handleMessageSubmit = (data: Message) =>
  {
    setLoading(true)

    // Axios Request
    axios.post<Message>('/api/resources/messages', data)
      .then((res) =>
      {
        // Add the message to the outbox in the client store
        dispatch(add({
          message: res.data,
          listingType: MessageListingTypes.Outbox
        }))

        // Reset all the form field values
        reset()

        // Success Message
        Swal.fire(
          'Success!',
          'The message was sent successfully.',
          'success'
        )
      })
      .catch((err) =>
      {
        // Error Message
        Swal.fire(
          'Failed!',
          'There was a problem with sending the message to the server.',
          'error'
        )
      })
      .finally(() =>
      {
        setLoading(false)
      })
  }

  // Render
  return(
    <Box m={5}>
      <form onSubmit={handleSubmit(handleMessageSubmit)}>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>

              {/* Sender Field Prefix */}
              <Grid item xs={1}>
                <Button
                  startIcon={<FontAwesomeIcon icon={faPortalEnter} />}
                  variant="contained"
                  className={classes.userFieldPrefix}
                  disabled
                  fullWidth
                  >
                  Sender
                </Button>
              </Grid>

              {/* Sender Field Input */}
              <Grid item xs={5}>
                <Controller
                  render={ props =>
                    <AsyncSelect
                      loadOptions={findUsers}
                      onChange={(value: OptionTypeBase) => props.onChange(value.value)}
                      styles={customSenderSelectStyles}
                    />
                  }
                  control={control}
                  defaultValue={null}
                  name="sender_id"
                />
              </Grid>

              {/* Recipient Field Prefix */}
              <Grid item xs={1}>
                <Button
                  startIcon={<FontAwesomeIcon icon={faPortalExit} />}
                  variant="contained"
                  className={classes.userFieldPrefix}
                  disabled
                  fullWidth
                >
                  Recipient
                </Button>
              </Grid>

              {/* Recipient Field Input */}
              <Grid item xs={5}>
                <Controller
                  render={ props =>
                    <AsyncSelect
                      loadOptions={findUsers}
                      onChange={(value: OptionTypeBase) => props.onChange(value.value)}
                      styles={customReceiverSelectStyles}
                    />
                  }
                  control={control}
                  defaultValue={null}
                  name="receiver_id"
                />
              </Grid>

              {/* Subject Field */}
              <Grid item xs={12}>
                <TextField
                  inputRef={register}
                  name="subject"
                  label="Subject"
                  variant="outlined"
                  error={!!errors.subject}
                  fullWidth
                />
              </Grid>

              {/* Message Field */}
              <Grid item xs={12}>
                <TextField
                  inputRef={register}
                  name="message"
                  label="Message"
                  multiline
                  rows={10}
                  variant="outlined"
                  error={!!errors.message}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Divider variant="middle" />
              </Grid>

              {/* Send Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={loading}
                  disableElevation>
                  {
                    loading
                      ? <CircularProgress size={24} />
                      : "send"
                  }
                </Button>
              </Grid>

            </Grid>
          </CardContent>
        </Card>
      </form>
    </Box>
  )
}
