var mongo = require('mongodb');
var db = require('../config/dbconnection');

exports.InsertEmployees = (EmployeeData)=> {
	return new Promise( (resolve, reject) => {
		db.get().collection('employee').insertMany(EmployeeData,(err, res)=> {
		if (err){
			console.log('err InsertEmp',err);
			reject(err);
		}else{
			console.log("1 document inserted");			
			resolve(res.insertedId);
		}
		});
	})
};

