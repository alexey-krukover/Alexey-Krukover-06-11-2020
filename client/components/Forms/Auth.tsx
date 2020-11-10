import {
  Button,
  Card,
  CardContent,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Divider,
  CircularProgress
} from "@material-ui/core";
import React, {useState} from "react";
import axios, {AxiosError} from "axios";
import {makeStyles} from '@material-ui/core/styles';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faKey, faUser} from '@fortawesome/pro-solid-svg-icons'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import {fetchValidatedUser} from "@/store/slices/authSlice";
import {useDispatch} from "react-redux";
import Swal from "sweetalert2";
import * as yup from "yup";

// Auth Type enum
enum AuthTypes {
  Register,
  Login
}

// Form Styling
const useStyles = makeStyles(() => ({
  root: {
    marginTop: 20,
    maxWidth: 500,
    margin: 'auto'
  }
}))

// Form Validation Schema
const validationSchema = yup.object().shape({
  username: yup.string().min(2).required(),
  password: yup.string().min(6).required(),
})

/**
 * The Auth Form component.
 *
 * @constructor
 */
export default function AuthForm()
{
  // Misc Hooks
  const classes = useStyles()
  const dispatch = useDispatch()
  const {register, errors, handleSubmit, setError} = useForm({
    resolver: yupResolver(validationSchema)
  })

  // Component State Hooks
  const [authQueryType, setAuthQueryType] = useState<AuthTypes>(null)

  /**
   * The authentication handler.
   *
   * @params type
   */
  const authHandler = (type: AuthTypes) => {
    return handleSubmit((data) => {
      let authRoute

      // Set the authentication progress as the specific type
      setAuthQueryType(type)

      // Set the authentication route base on the authentication method
      // TODO: For the routing use the global env
      switch(type) {
        case AuthTypes.Login:
          authRoute = '/api/auth/login'
          break
        case AuthTypes.Register:
          authRoute = '/api/auth/register'
          break
      }

      // Axios Request
      axios.post<null>(authRoute, data)
        .then((res) =>
        {
          dispatch(fetchValidatedUser())
        })
        .catch((err: AxiosError) =>
        {
          // Error handling for the server errors
          if (err.response)
          {
            // Stop the loading
            setAuthQueryType(null)

            // Wrong credentials error
            if(err.response.status == 401) {
              setError('username', {
                type: 'manual',
                message: "Either one or both the password and the username are wrong"
              })
            }
            // Username taken error
            else if(err.response.status == 403) {
              setError('username', {
                type: 'manual',
                message: "The username you tried to register with is already taken"
              })
            }
            // General error exception
            else {
              Swal.fire(
                'Failed!',
                'There was problem with the authentication process.',
                'error'
              )
            }
          }
        })
    })
  }

  /**
   * Get handler for the register authentication
   */
  const registerHandler = () => {
    return authHandler(AuthTypes.Register)
  }

  /**
   * Get handler for the login authentication
   */
  function loginHandler() {
    return authHandler(AuthTypes.Login)
  }

  // Render
  return(
    <Box className={classes.root}>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={3}>

            {/* Username Field */}
            <Grid item xs={12}>
              <TextField
                inputRef={register}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUser} />
                    </InputAdornment>
                  ),
                }}
                name="username"
                label="Username"
                variant="outlined"
                helperText={errors.username?.message}
                error={!!errors.username}
                fullWidth
              />
            </Grid>

            {/* Password Field */}
            <Grid item xs={12}>
              <TextField
                inputRef={register}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faKey} />
                    </InputAdornment>
                  ),
                }}
                name="password"
                type="password"
                label="Password"
                variant="outlined"
                helperText={errors.password?.message}
                error={!!errors.password}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Divider variant="middle" />
            </Grid>

            {/* Registration Button */}
            <Grid item xs={6}>
              <Button
                onClick={registerHandler()}
                disabled={authQueryType != null}
                variant="contained"
                color="secondary"
                fullWidth
                disableElevation>
                {
                  authQueryType == AuthTypes.Register
                    ? <CircularProgress size={24} />
                    : "Register"
                }
              </Button>
            </Grid>

            {/* Login Button */}
            <Grid item xs={6}>
              <Button
                onClick={loginHandler()}
                disabled={authQueryType != null}
                variant="contained"
                color="secondary"
                fullWidth
                disableElevation>
                {
                  authQueryType == AuthTypes.Login
                    ? <CircularProgress size={24} />
                    : "login"
                }
              </Button>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
