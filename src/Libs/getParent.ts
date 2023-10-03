export const  getArticleCatParent =  (unoque:string, lang:string) => {
     fetch(process.env.NEXT_PUBLIC_API_URL+'/article/cat/get_parent/'+unoque+'/'+lang)
    .then((v) => { 
        const cat:any = v.json()
        console.log(cat.title);
        
        return cat.title
    })
    .catch((e) => {
        console.log('Article get parent API: ', e)
        return ''
    })
    return ''
}