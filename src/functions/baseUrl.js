const url = () =>{
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        //return 'http://localhost:5656/api/'
        return process.env.API_URL
    }
    else {
        //return 'https://' + window.location.host + '/api/'
        return process.env.API_URL
    }
}

export default url