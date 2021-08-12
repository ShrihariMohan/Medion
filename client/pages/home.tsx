import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import * as userService from '../services/userService';
import * as draftService from '../services/draftService';
import ReadDraft from '../components/ReadDraft';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appRoot: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    appTitle: {
      flexGrow: 1,
    },
    cardRoot: {
      maxWidth: 275,
      margin: '8px',
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    cardTitle: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    flexContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    view: {
      position: "relative",
      bottom: 0,
      right: 0
    }

  }),
);

type userType = {
  email: string, name: string, _id: string, isSubscribed: boolean
}

type feedDraftsType = {
  userId: string, content: string, _id: string, title: string, createdBy: string
}

export default function Home() {
  const classes = useStyles();
  const [user, setUser] = useState<userType>();
  const [feedDrafts, setFeedDrafts] = useState<[feedDraftsType]>();

  console.log(feedDrafts);
  useEffect(() => {
    userService.getMe().then(setUser);
    draftService.getFeedDrafts().then(setFeedDrafts);
  }, [])

  return (
    <div className={classes.appRoot}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.appTitle}>
            Medion
          </Typography>
          <Button href="/mypages" color="inherit">My Pages</Button>
        </Toolbar>
      </AppBar>

      <div className={classes.flexContainer}>
        {feedDrafts?.map((draft, ind) => (
          <Card className={classes.cardRoot} key={draft._id}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {draft.title}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {draft.createdBy}
              </Typography>
              <ReadDraft draftId={draft._id} preview={true}></ReadDraft>
            </CardContent>
            <CardActions>
              <Button color='primary' href={"/read/" + draft._id} size="small" className={classes.view}>View</Button>
            </CardActions>
          </Card>)
        )}
      </div>
    </div>
  )
}