const url = () =>{
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5656/api/'
    }
    else {
        //return 'https://' + window.location.host + '/api/'
        return 'https://as-reportsquestcc-back-dev-01.azurewebsites.net/api/'
    }
}

export default url