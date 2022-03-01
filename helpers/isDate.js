const moment = require('moment');

const isDate = (value) =>{
    

    if ( !value ) {
        return false;
    }
    
    const fecha = moment( value, "MM-DD-YYYY" );
    if ( fecha.isValid() ) {
        return true;
    }else {
        return false;
    }
}

module.exports = { isDate };