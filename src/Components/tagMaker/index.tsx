import { Button, Chip, Input } from "@mui/joy"
import { useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"

export default function TagMaker(props:any) {
    const [input, setInput] = useState('')
    const [tags, setTags] = useState<string[]>([])

    const onChangeInput = (e:any) => {
        setInput(e.target.value)
    }
    const addTag = () => {
        if (input) {
            gt(input)
            setInput('')
        }
    }
    document.getElementById(props.id)?.addEventListener('keypress',(e) => {
        if(e.key === 'Enter') {
            addTag()
        }
    })

    const gt = (tag:string) => {
        props.getTags(tag)
    }
    return (
        <>
        <Input
                id={props.id}
                size={'lg'}
                startDecorator={<AiOutlineSearch />}
                endDecorator={<Button size="md"
                sx={{color:'white'}}
                    onClick={()=>addTag()}
                >+</Button>}
                fullWidth
                type=""
                value={input}
                onChange={(e) =>onChangeInput(e)}
                
        />

        
        </>
    )
}