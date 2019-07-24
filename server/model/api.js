var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var db = require('../config/dbconnection');
const config = require('config');

exports.InsertEmployees = (EmployeeData)=> {
	//console.log(EmployeeData,'EmployeeData');
	return new Promise( (resolve, reject) => {
		db.get().collection('employee').insertMany(EmployeeData,(err, res)=> {
		if (err){
			console.log('err InsertEmp',err);
			resolve(-1);
		}else{
			console.log("Many document inserted");			
			resolve(res.insertedIds.length);
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
	let limit_page = config.get('pagination.limit');
	
	if(filter_query.q && filter_query.q !=='' ){
		var search_q = new RegExp("^"+filter_query.q, "i");
		console.log(search_q);
		match_cond = {"$or": [{ "name": { "$regex": search_q } }, { "email": { "$regex": search_q }},{ "phone": { "$regex": search_q }}] };
	}
	
	if(filter_query.page && filter_query.page>1){
		var from_data = (filter_query.page-1)*limit_page;
	}else{
		var from_data = 0;
	}	
	
	if(filter_query.month_year){		
		var month_year_arr = filter_query.month_year.split(/[./-]+/);
		var month_year_frm = new Date(`${month_year_arr[1]}-${month_year_arr[0]}-01`);
		var month_year_to = new Date(`${month_year_arr[1]}-${month_year_arr[0]}-31`);
		console.log(month_year_to,'month_year',month_year_frm);
		match_cond['bill_date'] = {$gte:month_year_frm,$lte:month_year_to};		
	}
	
	console.log(from_data,'from_data');
	
	return new Promise( (resolve, reject) => {
		if(getCount==0){
					db.get().collection('employee').aggregate([
						 { $match: match_cond },
						 { $project: { name: "$name",phone:'$phone',email:'$email',position:'$position',level:'$level',emp_id: "$emp_id",doj: {$ifNull: [ {$dateToString: { format: "%d-%m-%Y", date: "$doj"}},''] } } },
						 { $sort: { _id: -1 } },
					     { $skip: from_data },
						 { $limit: limit_page },
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
								//console.log(result,'count res---->');
								resolve(result[0].count);
							}
					});			
		}
	})
};

exports.CheckEmployeeIDEmailAvailable = (emp_id,email)=> {
		var match_check ={};
		if(emp_id && email && emp_id!=='' && email!==''){
			var match_check = {$or:[{emp_id:emp_id},{email:email}]};
		}else if(emp_id){
			var match_check = {emp_id:emp_id};
		}else if(email){
			var match_check = {email:email};
		}
		//console.log(match_check,'match_check');
	return new Promise( (resolve, reject) => {
		db.get().collection('employee').countDocuments(match_check,(err, res)=> {
		if (err){
			//console.log('err CheckEmailID',err);
			reject(err);
		}else{
			//console.log("res",res);			
			resolve(res);
		}
		});
	})
};
