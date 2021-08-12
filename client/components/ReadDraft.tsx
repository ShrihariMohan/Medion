import React, { useEffect, useState } from "react";
import { Editor, EditorState, convertFromRaw, RichUtils, getDefaultKeyBinding } from 'draft-js';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as draftService from '../services/draftService';
import * as userService from '../services/userService';

import 'draft-js/dist/Draft.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }),
);

const ReadDraft: React.FC<{ draftId: string, preview: boolean }> = ({ draftId, preview }) => {
  const classes = useStyles();

  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(emptyContentState),
  );
  const [className, setClassName] = useState('RichEditor-editor');
  const [draftData, setDraftData] = useState<{ userId: string, content: string, title: string, _id: string }>();
  const [title, setTitle] = useState(draftData?.title || '');
  const [user, setUser] = useState<{ email: string, name: string, _id: string, isSubscribed: boolean }>();

  let currentState = editorState.getCurrentContent();
  console.log(editorState.getCurrentContent())
  if (!currentState.hasText() && currentState.getBlockMap().first().getType() !== 'unstyled') {
    setClassName(`${className} + RichEditor-hidePlaceholder`);
  }

  useEffect(() => {
    userService.getMe().then(setUser);
    if (draftId != '') {
      draftService.getDraftByDraftID(draftId).then((data) => {
        const editorDataRaw = JSON.parse(preview ? data.preview : data.content);
        emptyContentState = convertFromRaw(editorDataRaw)
        setEditorState(EditorState.createWithContent(emptyContentState))
        setDraftData(data);
      });
    }
  }, [draftId])

  useEffect(() => {
    setTitle(draftData?.title || '')
  }, [draftData?.title])

  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState)
      return 'handled';
    }
    return 'not-handled';
  }

  const mapKeyToEditorCommand = (e: any) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        editorState,
        4,
      );
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(e);
  }

  const getBlockStyle = (block: any) => {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return '';
    }
  }

  const styleMap = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };

  return (
    <div className="RichEditor-root-read-draft">
      <div className={className}>
        <Editor
          editorKey="editor"
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          keyBindingFn={mapKeyToEditorCommand}
          placeholder="Lets go man!"
          spellCheck={true}
          readOnly={true}
        />
      </div>

    </div>
  )
}

export default ReadDraft;

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

