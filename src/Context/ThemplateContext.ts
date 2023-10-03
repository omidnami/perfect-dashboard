import { createContext } from "react";

const ThemplateContext = createContext({
    type: "",
    name:"",
    plugins: [],
    position: [],
    footer_position: [],
    product_plugins: [],
    blog_plugins: [],
    service_plugins: [],
    project_plugins: [],
    slider_plugin: [],
    menu_position: [],
    config: [],
    lang: []
})

export default ThemplateContext