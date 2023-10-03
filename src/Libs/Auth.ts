export default class Author { 
    
   public static checkLogin () {
        const token = localStorage.getItem('_token_')
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/check/${token}`)
        .then((r) => {
            return r.json()
        })
        .catch((e) => {
            return e
        })
    }
    
}