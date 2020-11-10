import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  makeStyles,
  Typography,
  Box
} from "@material-ui/core"
import {Message, MessageListingTypes} from "@/types";
import React from "react";
import moment from "moment";
import {Delete} from "@material-ui/icons";
import {deleteMessage} from "@/store/slices/messagesSlice";
import {useDispatch} from "react-redux";

// The component styling
const useStyles = makeStyles(() => {
  return ({
    avatar: {
      textTransform: 'uppercase'
    },
    inline: {
      display: 'inline',
    },
    user: {
      flex: 'none',
      width: 200
    },
    username: {
      fontWeight: 600
    },
    subject: {
      color: 'rgb(0, 90, 158)',
      fontWeight: 600,
      marginRight: 30
    },
    message: {
      color: 'rgb(96, 94, 92)',
      marginLeft: 30,
      fontWeight: 400
    },
    timestamp: {
      textAlign: "right",
      minWidth: 120,
      fontSize: 12,
      fontWeight: 600,
      marginRight: 20,
      marginLeft: 20
    },
    userbox: {
      display: "flex",
      position: "relative",
      boxSizing: "border-box",
      textAlign: "left",
      alignItems: "center",
      justifyContent: "flex-start",
      justifySelf: "flex-start",
      alignSelf: "self-end"
    }
  })
})

// The component props constraint
export interface Props {
  messages: Array<Message>
  listingType: MessageListingTypes
  messageSelectionHandler: React.Dispatch<React.SetStateAction<Message>>
}

/**
 * The Message List component.
 *
 * @constructor
 */
export default function MessageList(props: Props)
{
  // Misc Hooks
  const classes = useStyles()
  const dispatch = useDispatch()

  /**
   * Handle deletion.
   *
   * @param message
   */
  const handleDelete = (message: Message) => {
    dispatch(deleteMessage({
      message: message,
      listingType: props.listingType
    }))
  }

  // Render
  return(
    <List component="nav">
      {
        props.messages.map((message) => {
          let username

          // Get the relevant username username based on the listing type
          switch (props.listingType) {
            case MessageListingTypes.Inbox:
              username = message.sender.username
              break;
            case MessageListingTypes.Outbox:
              username = message.receiver.username
              break;
          }

          // Render
          return (
            <div key={message.id}>
              <ListItem button onClick={() => props.messageSelectionHandler(message)}>

                {/* User Box */}
                <Box className={classes.userbox}>

                  {/* User avatar */}
                  <ListItemIcon>
                    <Avatar className={classes.avatar}>
                      {username.substr(0, 2)}
                    </Avatar>
                  </ListItemIcon>

                  {/* User Name */}
                  <ListItemText className={classes.user} primary={
                    <Typography component="span" className={classes.username}>
                      {username}
                    </Typography>
                  }/>

                </Box>

                {/* Message Subject & Content */}
                <ListItemText
                  primary={
                    <>
                      <Typography component="span" className={classes.subject}>
                        {message.subject}
                      </Typography>
                      {"  —  "}
                      <Typography component="span" className={classes.message}>
                        {message.message}
                      </Typography>
                    </>
                  }
                />

                {/* Message Timestamp */}
                <Typography component="span" className={classes.timestamp}>
                  {moment(message.createdAt).format('D MMM YY, hh:mm')}
                </Typography>

                {/* Message Delete Button */}
                <IconButton onClick={(event) => {
                  event.stopPropagation()
                  handleDelete(message)
                }}>
                  <Delete/>
                </IconButton>

              </ListItem>

              {/* Message Divider */}
              <Divider variant="middle" component="li" />
            </div>
          )
        })
      }
    </List>
  )
}
