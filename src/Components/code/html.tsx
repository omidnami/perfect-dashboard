import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { tags as t } from '@lezer/highlight';
import { aura, auraInit } from '@uiw/codemirror-theme-aura';
function CodeHtml(props:any) {
  const [value, setValue] = React.useState(props.defaultValue);
  const onChange = React.useCallback((val:any, viewUpdate:any) => { 
    console.log('changed html');
       
    setValue(val);
    props.value(val)
  }, []);
  return <CodeMirror value={props.defaultValue}  theme={aura}
  height="400px" extensions={[html({})]} onChange={onChange} />;
}
export default CodeHtml;