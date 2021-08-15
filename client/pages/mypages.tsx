import Head from 'next/head'
import clsx from 'clsx';
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React from 'react';
import * as userService from '../services/userService'
import * as draftService from '../services/draftService';
import { useEffect, useState } from 'react';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Draft from '../components/Draft';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { convertFromRaw, convertToRaw } from 'draft-js';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useRouter } from 'next/router'


const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    title: {
      flexGrow: 1
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginBottom: '64px'
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'space-between',
    },

    newPage: {
      marginLeft: "8px"
    },
    logoutbtn: {
      width: "32px",
      marginLeft: "16px",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      padding: theme.spacing(3),
      marginLeft: 0,
    },
  }),
);

type availableDraftsType = {
  userId: string, content: string, _id: string, title: string
}

type userType = {
  email: string, name: string, _id: string, isSubscribed: boolean
}

export default function Home() {
  const [user, setUser] = useState<userType>();
  const [availableDrafts, setDrafts] = useState<[availableDraftsType]>();
  const [draftId, setdraftId] = useState('');
  const router = useRouter()

  const fetchDrafts = () => {
    return draftService.getDrafts().then(data => {
      setDrafts(data);
      return data;
    });
  }

  useEffect(() => {
    userService.getMe().then(setUser);
    fetchDrafts().then((data) => {
      setdraftId(data[0]._id);
    });
  }, [])

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const deleteDraft = async (draftId: string) => {
    console.log(draftId);
    try {
      await draftService.deleteDraft(draftId);
    }
    catch (err) {
      console.log(err)
    }
    finally {
      fetchDrafts();
    }
  }

  const addNewPage = () => {
    let emptyContentState = convertFromRaw({
      entityMap: {},
      blocks: [
        {
          text: '',
          key: 'foo',
          type: 'unstyled',
          entityRanges: [],
          depth: 5,
          inlineStyleRanges: [],
        },
      ],
    });

    draftService.publishDraft(convertToRaw(emptyContentState)).then((data) => {
      setdraftId(data._id);
      console.log(data);
      fetchDrafts();
    });
  }


  const toggleSubscription = () => {
    console.log("Inside toggleing")
    userService.subscription(!user?.isSubscribed).then(setUser)
  }

  return (
    <div>
      <Head>
        <title>Medion</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
              <a href="/home">Medion</a>
            </Typography>
            {user ? <Button onClick={toggleSubscription} color="inherit">{user.isSubscribed ? 'Unsubscribe' : 'Subscribe'}</Button> : null}
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            {user?.name ? <ListItemText className={classes.newPage} primary={user.name} /> : <Button href="http://localhost:3000/auth/google" color="primary">
              Login
            </Button>} <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          {user?.name ? <div>

            <List>

              <ListItem button onClick={addNewPage}>
                <AddCircleOutlineIcon /> <ListItemText className={classes.newPage} primary='Add New Page' />
              </ListItem>
              {availableDrafts?.map((draft, index) => (
                <ListItem button key={draft._id} onClick={() => setdraftId(draft._id)}>
                  <ListItemText primary={draft.title} />
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <Button color="secondary" {...bindTrigger(popupState)}>
                          <MoreVertIcon />
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          <MenuItem onClick={() => { deleteDraft(draft._id); }}>Delete</MenuItem>
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </ListItem>
              ))}
            </List>
            <Button href="http://localhost:3000/auth/logout" color="primary" className={classes.logoutbtn}>
              <ExitToAppIcon /> <span className={classes.logoutbtn}> logout</span>
            </Button> </div> : null}

        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <Draft draftId={draftId} readOnly={false} preview={false} />
        </main>
      </div>
    </div>
  )
}
