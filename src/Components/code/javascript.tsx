import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';
import { aura, auraInit } from '@uiw/codemirror-theme-aura';
function CodeJavascript(props:any) {
  const [value, setValue] = React.useState(props.defaultValue);
  const onChange = React.useCallback((val:any, viewUpdate:any) => { 
    console.log('changed html');
       
    setValue(val);
    props.value(val)
  }, []);
  return <CodeMirror value={props.defaultValue}  theme={aura}
  height="400px" extensions={[javascript({ jsx: true })]} onChange={onChange} />;
}
export default CodeJavascript;