import { convertFromRaw, EditorState } from 'draft-js';
import { faIR } from 'draft-js/lib/i18n';

export const editorStateFromRaw = (rawContent) => {
  const contentState = convertFromRaw(rawContent);
  return EditorState.createWithContent(contentState, faIR);
};

export const editorStateToRaw = (editorState) => {
  const contentState = editorState.getCurrentContent();
  return JSON.stringify(convertToRaw(contentState));
};