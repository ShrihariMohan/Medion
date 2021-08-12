import { useRouter } from 'next/router'
import ReadDraft from '../../components/ReadDraft'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as userService from '../../services/userService';
import * as draftService from '../../services/draftService';

import { useEffect, useState } from 'react';

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


const Post = () => {
  const classes = useStyles();
  const [user, setUser] = useState<userType>();
  const [draftData, setDraftData] = useState<{ userId: string, content: string, title: string, _id: string }>();


  useEffect(() => {
    userService.getMe().then(setUser);
    draftService.getDraftByDraftID(draftId).then((data) => {
      setDraftData(data);
    });
  }, [draftData])
  const router = useRouter()
  const params = router.query;
  let draftId = '';
  if (typeof (params.draftId) == 'string')
    draftId = params.draftId!;


  return (
    <div className={classes.appRoot}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.appTitle}>
            <a href="/home">Medion</a>
          </Typography>
          <Button href="/" color="inherit">My Pages</Button>
        </Toolbar>
      </AppBar>
      <ReadDraft draftId={draftId} preview={false}></ReadDraft>
      {(user?.isSubscribed || user?._id == draftData?.userId) ? '' : "Please Subscribe  to view full content"}

    </div>
  )
}

export default Post