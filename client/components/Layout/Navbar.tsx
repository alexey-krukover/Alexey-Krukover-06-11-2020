import {
  AppBar,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import {selectAuthUser, logoutUser} from "@/store/slices/authSlice";
import {faInbox, faPaperPlane, faSignOutAlt} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/dist/client/router";
import {MoreVertRounded} from "@material-ui/icons";
import Link from "next/link";
import React, {useState} from "react";

// The component styling
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

/**
 * The Navbar component.
 *
 * @constructor
 */
export default function Navbar() {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null|HTMLElement>(null)
  const authUser = useSelector(selectAuthUser)
  const classes = useStyles()
  const router = useRouter()
  const dispatch = useDispatch()

  /**
   * Handle the opening of the menu bar..
   *
   * @param event
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  /**
   * Handle the closing of the menu bar.
   */
  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  /**
   * Handle the user logout.
   */
  function handleLogout(){
    dispatch(logoutUser())
    setMenuAnchorEl(null)
  }

  // Render
  return(
    <div className={classes.root} >
      <AppBar elevation={0} position="static">
        <Toolbar>

          {/* Page Title */}
          <Typography variant="h6" className={classes.title}>Mail</Typography>
          <IconButton onClick={handleClick} color="inherit">
            <MoreVertRounded />
          </IconButton>

          {/* Header Menu */}
          <Menu
            id="simple-menu"
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={handleClose}
          >
            {/* Message Compose Navigation */}
            <Link href="/compose">
              <MenuItem selected={router.pathname == "/compose"}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </ListItemIcon>
                <ListItemText primary="Compose" />
              </MenuItem>
            </Link>

            {/* Message List Navigation */}
            <Link href="/">
              <MenuItem selected={router.pathname == "/"}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faInbox} />
                </ListItemIcon>
                <ListItemText primary="Messages" />
              </MenuItem>
            </Link>

            {/* Logout Button */}
            {
              authUser != null &&
              <div>
                <Divider variant="middle" />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </div>
            }
          </Menu>

        </Toolbar>
      </AppBar>
    </div>
  )
}
