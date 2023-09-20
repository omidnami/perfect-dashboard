import { Avatar, ListDivider, ListItemDecorator, Option, Select, SelectOption } from "@mui/joy";
import React from "react";

const options = [
    { value: '1', label: 'FA', src: '/fa.png' },
    { value: '2', label: 'EN', src: '/en.webp' },
    { value: '3', label: 'AR', src: '/ar.svg' },
  ];
  
  function renderValue(option: SelectOption<string> | null) {
    if (!option) {
      return null;
    }
  
    return (
      <React.Fragment>
        <ListItemDecorator>
          <Avatar size="sm" src={options.find((o) => o.value === option.value)?.src} />
        </ListItemDecorator>
        {option.label}
      </React.Fragment>
    );
  }

export default function Lang(props:any) {
    return (
        <Select
                defaultValue={props.dv}
                value={props.dv}
                slotProps={{
                    listbox: {
                    
                    },
                }}
                sx={props.style}
                renderValue={renderValue}
                onChange={(e, n) => props.onChange(n)}
                disabled={props.disable}
                >
                    {options.map((option, index) => (
                        <React.Fragment key={option.value}>
                        {index !== 0 ? <ListDivider role="none" inset="startContent" /> : null}
                        <Option value={option.label} label={option.label}>
                            <ListItemDecorator>
                            <Avatar size="sm" src={option.src} />
                            </ListItemDecorator>
                            {option.label}
                        </Option>
                        </React.Fragment>
                    ))}

        </Select>
        
    )
}