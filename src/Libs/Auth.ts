export default class Author { 
    
   public static checkLogin () {
        const token = localStorage.getItem('_token_')
        fetch('http://127.0.0.1:8000/api/v1/auth/check/'+token)
        .then((r) => {
            return r.json()
        })
        .catch((e) => {
            return e
        })
    }
    
}