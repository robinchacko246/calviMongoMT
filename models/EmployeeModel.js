const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    
    FirstName: {
        type: String,
        required: true
    },
    
    LastName: {
        type: String
        
    },
    
    Age: {
        type: String
        
    },
    Email: {
        type: String
        
    },
    Phone: {
        type: String
        
    }, 
    City: {
        type: String
        
    }, 
    Country: {
        type: String
        
    },
    Image: {
        type: String
        
    },
    EmployeeId:
    {
        type:String
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
    
    
});

module.exports = {Employee: mongoose.model('employee', PostSchema )};
