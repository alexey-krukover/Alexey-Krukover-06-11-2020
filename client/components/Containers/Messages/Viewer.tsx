import {
  Avatar,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  makeStyles,
  Typography,
  CardContent,
  Card,
  Button,
  CardActions,
  Grid,
  ListItemAvatar
} from "@material-ui/core"
import {Message, MessageListingTypes} from "@/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPortalEnter, faTrash} from "@fortawesome/pro-solid-svg-icons";
import {faPortalExit} from "@fortawesome/pro-solid-svg-icons/faPortalExit";
import {Close} from "@material-ui/icons"
import {useDispatch} from "react-redux";
import {deleteMessage} from "@/store/slices/messagesSlice";
import React from "react";
import moment from "moment";

// The component styling
const useStyles = makeStyles(() => {
  return ({
    root: {
      margin: 10
    },
    title: {
      overflow: "hidden"
    }
  })
})

// The component props constraint
export interface Props {
  message: Message
  listingType: MessageListingTypes
  messageSelectionHandler: React.Dispatch<React.SetStateAction<Message>>
}

/**
 * The Message Viewer component.
 *
 * @param props
 * @constructor
 */
export default function MessageViewer(props: Props)
{
  // Misc Hooks
  const classes = useStyles()
  const dispatch = useDispatch()

  /**
   * Handle deletion.
   */
  const handleDelete = () => {
    dispatch(deleteMessage({
      message: props.message,
      listingType: props.listingType
    }))
  }

  // Render
  return(
    <div className={classes.root}>

      {/* Message Header */}
      <Grid container alignItems="center">

        {/* Message Title */}
        <Grid item xs={9} className={classes.title}>
          <Typography gutterBottom variant="h4">
            {props.message.subject}
          </Typography>
        </Grid>

        {/* Message Users */}
        <Grid item xs={3}>
          <Grid container alignItems="center">

            {/* Sender User */}
            <Grid item xs>
              <ListItem>

                {/* Sender User Avatar */}
                <ListItemAvatar>
                  <Avatar>
                    <FontAwesomeIcon icon={faPortalEnter}/>
                  </Avatar>
                </ListItemAvatar>

                {/* Sender User Name */}
                <ListItemText primary={props.message.sender.username} secondary="Sender" />

              </ListItem>
            </Grid>

            {/* Recipient User */}
            <Grid item xs>
              <ListItem>

                {/* Recipient User Avatar */}
                <ListItemAvatar>
                  <Avatar>
                    <FontAwesomeIcon icon={faPortalExit}/>
                  </Avatar>
                </ListItemAvatar>

                {/* Recipient User Name */}
                <ListItemText primary={props.message.receiver.username} secondary="Recipient" />

              </ListItem>
            </Grid>

            {/* Message Close Button */}
            <Grid item xs={2}>
              <IconButton  onClick={() => props.messageSelectionHandler(null)}>
                <Close />
              </IconButton>
            </Grid>

          </Grid>
        </Grid>

      </Grid>

      {/* Message Content */}
      <Card variant="outlined">

        {/* Message Content Header */}
        <CardActions>
          <Grid container alignItems="center">

            {/* Message Delete Button */}
            <Grid item xs={1}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                disableElevation
                onClick={handleDelete}
                startIcon={
                  <FontAwesomeIcon icon={faTrash}/>
                }
              >
                Remove
              </Button>
            </Grid>

            <Grid item xs={10} />

            {/* Message Timestamp */}
            <Grid item xs={1}>
              <Typography>
                {moment(props.message.createdAt).format('D MMM YY, hh:mm')}
              </Typography>
            </Grid>

          </Grid>
        </CardActions>

        <Divider variant="middle" />

        {/* Message Text Content */}
        <CardContent>
          <Typography>
            {props.message.message}
          </Typography>
        </CardContent>

      </Card>

    </div>
  )
}
