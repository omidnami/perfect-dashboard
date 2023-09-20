import { Children } from "react";

export default function Container({children}:any) {
    return (
        <section id="uix-continer" className="uix-continer">
            <div style={{minHeight:'100vh'}} className="uix-continer-body">{children}</div>
        </section>
    )
}

