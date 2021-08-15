import React, { useEffect, useState } from "react";
import { EditorState, convertFromRaw, RichUtils, getDefaultKeyBinding, convertToRaw, ContentState } from 'draft-js';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useDebouncedCallback } from 'use-debounce';
import * as draftService from '../services/draftService';
import * as userService from '../services/userService';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';

import 'draft-js/dist/Draft.css';

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);

const imagePlugin = createImagePlugin({ decorator });

const mockUpload = (...args: any) => {
  console.log(args)
}

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: mockUpload,
  addImage: imagePlugin.addImage as any,
});

const plugins = [
  dragNDropFileUploadPlugin,
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
];

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

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Draft: React.FC<{ draftId: string, readOnly: boolean, preview: boolean }> = ({ draftId, readOnly, preview }) => {
  const classes = useStyles();

  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(emptyContentState),
  );
  const [className, setClassName] = useState('RichEditor-editor');
  const [draftData, setDraftData] = useState<{ userId: string, content: string, title: string, _id: string, level: string }>();
  const [title, setTitle] = useState(draftData?.title || '');
  const [user, setUser] = useState<{ email: string, name: string, _id: string }>();
  const [open, setOpen] = React.useState(false);
  const [level, setLevel] = React.useState(draftData?.level);


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

  let currentState = editorState.getCurrentContent();

  if (!currentState.hasText() && currentState.getBlockMap().first().getType() !== 'unstyled') {
    setClassName(`${className} + RichEditor-hidePlaceholder`);
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const debounced = useDebouncedCallback(
    () => {
      console.log("saving the draft")
      saveDraft().then(handleClick);
    },
    3000
  );

  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState)
      return 'handled';
    }
    return 'not-handled';
  }

  console.log(draftData);

  const mapKeyToEditorCommand = (e: any) => {
    if (e.keyCode === 9) {
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

  const onchange = (state: any) => {
    setEditorState(state);
    debounced();

  }
  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  }

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  const handleChange = (event: any) => {
    console.log(event.target.value);
    setTitle(event.target.value)
  }

  const handleLevel = (event: any) => {
    console.log(event.target.value);
    setLevel(event.target.value)
  }

  const saveDraft = async () => {
    const currentState = editorState.getCurrentContent();
    const preview = convertToRaw(currentState).blocks.slice(0, 3);
    console.log(convertToRaw(currentState));
    console.log(preview);
    let previewContentState = convertFromRaw({
      entityMap: {},
      blocks: preview
    });
    if (draftData?._id) draftService.saveDraft(draftData?._id, convertToRaw(currentState),
      title, convertToRaw(previewContentState), level!);
    else console.log('error cannot save');
  }

  return (
    <div className="RichEditor-root">
      {!readOnly ?
        <div>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField label="Title" onChange={handleChange} value={title} />
          </form>
          <BlockStyleControls
            editorState={editorState}
            onToggle={toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={toggleInlineStyle}
          />
        </div> : null
      }
      <div className={className}>
        <Editor
          editorKey="editor"
          editorState={editorState}
          onChange={onchange}
          handleKeyCommand={handleKeyCommand}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          keyBindingFn={mapKeyToEditorCommand}
          placeholder="Lets go man!"
          spellCheck={true}
          readOnly={readOnly}
          plugins={plugins}
        />
      </div>
      {user ? <Button variant="outlined" color="primary" size="small" onClick={saveDraft}>
        Save Draft
      </Button> : null}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Auto Saved
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Draft;

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },

];

var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

type StyleButtonType = {
  active: boolean,
  label: string,
  onToggle: (style: string) => void,
  style: string

}

const StyleButton: React.FC<StyleButtonType> = ({ active, label, onToggle, style }) => {
  const [className, setClassName] = useState('RichEditor-styleButton');

  useEffect(() => {
    if (active) setClassName(`${className} RichEditor-activeButton`)
    else setClassName(`RichEditor-styleButton`)
  }, [active])

  const onToggleFn = (e: any) => {
    e.preventDefault();
    onToggle(style);
  };
  return (
    <span className={className} onMouseDown={onToggleFn}>
      {label}
    </span>
  )
}

const InlineStyleControls: React.FC<{ editorState: EditorState, onToggle: (block: string) => void }> = ({ editorState, onToggle }) => {
  const currentStyle = editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      )}
    </div>
  );

}
const BlockStyleControls: React.FC<{ editorState: EditorState, onToggle: (block: string) => void }> = ({ editorState, onToggle }) => {
  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      )}
    </div>
  );
}
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


