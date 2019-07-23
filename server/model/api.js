var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var db = require('../config/dbconnection');

exports.InsertEmployees = (EmployeeData)=> {
	return new Promise( (resolve, reject) => {
		db.get().collection('employee').insertMany(EmployeeData,(err, res)=> {
		if (err){
			console.log('err InsertEmp',err);
			resolve(0);
		}else{
			console.log("Many document inserted");			
			resolve(res.insertedId);
		}
		});
	})
};

exports.CheckEmailAvailable = (email)=> {
	return new Promise( (resolve, reject) => {
		db.get().collection('employee').countDocuments({email:email},(err, res)=> {
		if (err){
			console.log('err CheckEmail',err);
			reject(err);
		}else{
			console.log("res",res);			
			resolve(res);
		}
		});
	})
};

exports.InsertEmployee = (EmployeeData)=> {	
	return new Promise( (resolve, reject) => {
		db.get().collection('employee').insertOne(EmployeeData,(err, res)=> {
		if (err){
			console.log('err InsertEmp',err);
			resolve(0);
		}else{
			//console.log(res,'res');
			console.log("1 document inserted");			
			resolve(res.insertedId);
		}
		});
	})
};

exports.GetEmployee = (filter_query,getCount)=> {

	let match_cond = {}; 
	
	if(filter_query.q && filter_query.q !=='' ){
		var search_q = new RegExp("^"+filter_query.q, "i");
		console.log(search_q);
		match_cond = {"$or": [{ "name": { "$regex": search_q } }, { "email": { "$regex": search_q }},{ "phone": { "$regex": search_q }}] };
	}
	
	if(filter_query.from && filter_query.from > 0){
		var from_data = filter_query.from;
	}else{
		var from_data = 0;
	}
	
	if(filter_query.limit && filter_query.limit > 0){
		var limit_data = filter_query.limit;
	}else{
		var limit_data = 10;
	}
	
	if(filter_query.month_year){		
		var month_year_arr = filter_query.month_year.split(/[./-]+/);
		var month_year_frm = new Date(`${month_year_arr[1]}-${month_year_arr[0]}-01`);
		var month_year_to = new Date(`${month_year_arr[1]}-${month_year_arr[0]}-31`);
		console.log(month_year_to,'month_year',month_year_frm);
		match_cond['bill_date'] = {$gte:month_year_frm,$lte:month_year_to};		
	}
	
	console.log(match_cond,'match_cond');
	
	return new Promise( (resolve, reject) => {
		if(getCount==0){
					db.get().collection('employee').aggregate([
						 { $match: match_cond },
						 { $project: { _id:0,name: "$name",phone:'$phone',email:'$email',position:'$position',level:'$level',doj: {$ifNull: [ {$dateToString: { format: "%d-%m-%Y", date: "$doj"}},''] } } },
						 { $sort: { _id: -1 } },
					     { $skip: parseInt(from_data) },
						 { $limit: parseInt(limit_data) },
					]).toArray(function(err, result) 	{							
							if(err){
								console.log(err,'err---'); //reject(err);
								resolve([]);
							}else{
								//console.log(res,'res---->');
								resolve(result);
							}
					});
		}else{			
					db.get().collection('employee').aggregate([
						 { $match: match_cond },
						 { $group: { _id: null, count: { $sum: 1 } } }				
					]).toArray(function(err, result) 	{							
							if(err){
								console.log(err,'err---'); //reject(err);
								resolve(0);
							}else{
								console.log(result,'count res---->');
								resolve(result[0].count);
							}
					});			
		}
	})
};
