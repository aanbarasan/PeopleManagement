var express = require('express');
var router = express.Router();
//const multer = require('multer');
//const upload = multer();
var path = require('path');
const XLSX = require('xlsx');
var fs = require('fs');
var uniqid = require('uniqid');
const config = require('config');
const { check, validationResult } = require('express-validator');

var ApiModel = require('../model/api.js');
const xlFolderPath = config.get('generalConfig.xlxsFolderPath');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/upload-employee-xlxs', async (req, res, next) => {
	
	//console.log(req.files.employee_xlxs,'----------',req.files.employee_xlxs.mimetype,'-----',req.files.employee_xlxs.tempFilePath);console.log(req.files.employee_xlxs.tempFilePath);
	if(req.files && req.files.employee_xlxs){
		let file_ext_name = path.extname(req.files.employee_xlxs.name);
		console.log(file_ext_name,'file_ext_name');
		if(file_ext_name=='.xlsx'){		
			
			employeeFile = req.files.employee_xlxs;
			let file_name = uniqid()+file_ext_name;	
			uploadPath = xlFolderPath+file_name;

			  employeeFile.mv(uploadPath, async function(err) {
				if (err) {
					return res.status(500).send(err);
				}else{
					try{
						var workbook = XLSX.readFile(uploadPath);
					}catch(e){
						console.log(e,'errror');
					}						
					//var xl_json = XLSX.utils.sheet_to_json(workbook.SheetNames[0]);						
					var first_sheet_name = workbook.SheetNames[0];
					var address_of_cell = 'A1';						 
					/* Get worksheet */
					var worksheet = workbook.Sheets[first_sheet_name];						
					var xl_json = XLSX.utils.sheet_to_json(worksheet);
					//console.log(worksheet['B1'].v,'---workbook----->',xl_json);					
					var created_at = new Date();
					for (let i = 0; i < xl_json.length; i++) {
						//console.log(xl_json[i]);
						xl_json[i].created_at = created_at;					  						  
						let dob_val = xl_json[i].dob;
						delete xl_json[i].dob;
						//console.log(dob_val,'dob_val');						
						let dob_obj = new Date(1900, 0, dob_val); //date-formatted columns (such as 11/4/14) it gives it a value of 41947
						if(typeof dob_val == 'number' && dob_obj && dob_obj !== null){
							//console.log(dob_obj,'dob_obj');
							xl_json[i].dob=dob_obj;
						}else{
							//console.log(dob_obj,'dob_obj--else');
						}

						if(xl_json[i].phone){							
							xl_json[i].phone = xl_json[i].phone.toString();							
						}

						if(xl_json[i].emergency_contact){
							xl_json[i].emergency_contact = xl_json[i].emergency_contact.toString();
						}						
					}
					let emp_res = await ApiModel.InsertEmployees(xl_json);

					// delete file named 'sample.txt'
					fs.unlink(uploadPath, function (err) {
					    if (err) throw err;
					    // if no error, file has been deleted successfully
					    console.log('File deleted!');
					}); 
					if(emp_res==0){
			  			res.json({ status:422,message:'Server error, please try again'});
			  		}else{
			  			res.json({ status:200,message:'Uploaded successfully '});
			  		}	
				}		
			  })
		}else{
			res.json({ status:422,message:'Send valid file'});
		}
	}else{
		res.json({ status:422,message:'File not found'});
	}
  
});

router.post('/add-employee', [
  check('name').trim().isAlpha().isLength({ min: 3,max:10}),check('last_name').trim().isAlpha().isLength({ min:1,max:40}),check('gender').toInt().isLength({ min:1,max:2 }),check('position').trim().isLength({ min: 4,max:30 }),check('level').trim().isLength({ min: 1,max:10 }),check('email').isEmail(),check('date_of_birth').trim().isLength({ min:4,max:30}),check('date_of_join').trim().isLength({ min:1,max:30}),check('blood_group').trim().isLength({ min:1,max:30}),check('phone').trim().isLength({ min:8,max:20}),check('emergency_contact').trim().isLength({ min:8,max:20}),check('project_manager').trim().isAlpha().isLength({ min:3,max:50}),check('project_manager_n_plus').trim().isAlpha().isLength({ min:3,max:50}),check('permanent_address').trim().isLength({ min:3,max:250}),check('present_address').trim().isLength({ min:3,max:250}),check('emp_id').toInt().isLength({ min:2,max:10})
], async (req, res) => {	
	//console.log(req.body,'req-----innnn--'); 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
	  //res.status(422)
     res.json({ status:422,errors: errors.array() });
  }else{
	  	//console.log('---',req.body.name,'---');
	  	let email_exist = await ApiModel.CheckEmailAvailable(req.body.email);
	  	if(email_exist>0){
	  		res.json({ status:422,message:'Email has already registered'});
	  	}else{
	  		let date_of_birth = new Date(req.body.date_of_birth);
	  		let date_of_join = new Date(req.body.date_of_join);
	  		let emp_info = {name:req.body.name,gender:req.body.gender,position:req.body.position,level:req.body.level,email:req.body.email,dob:date_of_birth,doj:date_of_join,blood_group:req.body.blood_group,phone:req.body.phone,emergency_contact:req.body.emergency_contact,project_manager:req.body.project_manager,manager_n_plus:req.body.project_manager_n_plus,permanent_address:req.body.permanent_address,present_address:req.body.present_address,created_at:new Date()};
	  		let insert_emp = await ApiModel.InsertEmployee(emp_info);
	  		if(insert_emp==0){
	  			res.json({ status:422,message:'Server error, please try again'});
	  		}else{
	  			res.json({ status:200,message:'Employee added successfully'});
	  		}
	  	}	
  }   
});

router.get('/get-sample-xl', function(req, res){
  let sample_file = './server/public/download/sample.xlsx';
  res.download(sample_file); // Set disposition and send it.
});

router.get('/get-employees', async (req, res, next) => {

	let q = req.query.q;
	let position = req.query.position;	
	let from = req.query.from;
	let limit = req.query.limit;

	let month_year = req.query.month_year;
	var filter_query = {q:q,from:from,limit:limit,position:position};

  	let employee_list = await ApiModel.GetEmployee(filter_query,0);
  	res.json({status:200,employee_list:employee_list});
});


module.exports = router;
