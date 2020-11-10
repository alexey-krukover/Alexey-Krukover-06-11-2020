import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Grid,
  Chip
} from "@material-ui/core"
import {Message, MessageListingTypes} from "@/types";
import React, {useEffect, useState} from "react";
import {faInboxIn, faInboxOut} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useSelector} from "react-redux";
import {selectInbox, selectOutbox} from "@/store/slices/messagesSlice";
import MessageList from "@/components/Containers/Messages/List";
import MessageViewer from "@/components/Containers/Messages/Viewer";

/**
 * The Message Container component.
 *
 * @constructor
 */
export default function MessagesContainer()
{
  // Application State Hooks
  const inbox = useSelector(selectInbox)
  const outbox = useSelector(selectOutbox)

  // Component State Hooks
  const [selectedListing, setSelectedListing] = useState<MessageListingTypes>(MessageListingTypes.Inbox)
  const [selectedMessage, setSelectedMessage] = useState<Message>(null)

  // Effect Hooks
  useEffect(() =>
  {
    // Reset the message selection id the selected message was removed
    if (!getSelectedListingMessages().includes(selectedMessage)) {
      setSelectedMessage(null)
    }
  });

  /**
   * Get the messages of the selected listing.
   */
  const getSelectedListingMessages = (): Message[] => {
    switch (selectedListing) {
      case MessageListingTypes.Inbox:
        return inbox
      case MessageListingTypes.Outbox:
        return outbox
    }
  }

  /**
   * Get a handler for changing listing type.
   *
   * @param type
   */
  const listingChangeHandler = (type: MessageListingTypes) => {
    return () => {
      setSelectedListing(type)
      setSelectedMessage(null)
    }
  }

  // Render
  return(
    <Grid container spacing={3}>

      {/* Message Listing Selection */}
      <Grid item xs={2}>
        <List component="nav">

          {/* Inbox Selection */}
          <ListItem
            button
            key={MessageListingTypes.Inbox}
            selected={selectedListing === MessageListingTypes.Inbox}
            onClick={listingChangeHandler(MessageListingTypes.Inbox)}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faInboxIn} size="lg" />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
            <ListItemSecondaryAction>
              <Chip label={inbox.length} color="secondary" variant="outlined"/>
            </ListItemSecondaryAction>
          </ListItem>

          {/* Outbox Selection */}
          <ListItem
            button
            key={MessageListingTypes.Outbox}
            selected={selectedListing === MessageListingTypes.Outbox}
            onClick={listingChangeHandler(MessageListingTypes.Outbox)}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faInboxOut} size="lg" />
            </ListItemIcon>
            <ListItemText primary="Outbox" />
            <ListItemSecondaryAction>
              <Chip label={outbox.length} color="secondary" variant="outlined"/>
            </ListItemSecondaryAction>
          </ListItem>

        </List>

      </Grid>

      {/* Messages Panel */}
      <Grid item xs={10}>
        {
          selectedMessage === null
            ?
              <MessageList
                listingType={selectedListing}
                messages={getSelectedListingMessages()}
                messageSelectionHandler={setSelectedMessage}
              />
            :
              <MessageViewer
                listingType={selectedListing}
                message={selectedMessage}
                messageSelectionHandler={setSelectedMessage}
              />
        }
      </Grid>

    </Grid>
  )
}
