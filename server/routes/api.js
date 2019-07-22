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

//upload.array()
router.post('/upload-employee-xlxs', async (req, res, next) => {
	
	//console.log(req.files.employee_xlxs,'----------',req.files.employee_xlxs.mimetype,'-----',req.files.employee_xlxs.tempFilePath);
	
	//console.log(req.files.employee_xlxs.tempFilePath);
	
	if(req.files && req.files.employee_xlxs){
		let file_ext_name = path.extname(req.files.employee_xlxs.name);
		console.log(file_ext_name,'file_ext_name');
		if(file_ext_name=='.xlsx'){
			//const filePath = './tmp/sample.xlsx';
						
			
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
					res.json({ status:200,message:'Uploaded successfully '});	
				}		
			  })
		}else{
			res.json({ status:403,message:'Send valid file'});
		}
	}else{
		res.json({ status:403,message:'file not found'});
	}
  
});

router.post('/add-employee', [
  check('name').isLength({ min: 3,max:10}),  
  check('gender').isLength({ min:1,max:2 }),  
  check('position').isLength({ min: 4,max:30 }),
  check('level').isLength({ min: 1,max:10 }),
  check('email').isEmail(),
  check('date_of_birth').isLength({ min:4,max:30}),
  check('date_of_join').isLength({ min:1,max:30}),
  check('blood_group').isLength({ min:1,max:30}),
  check('phone').isLength({ min:8,max:20}),
  check('emergency_contact').isLength({ min:8,max:20}),
  check('project_manager').isLength({ min:3,max:50}),
  check('project_manager_n_plus').isLength({ min:3,max:50}),
  check('permanent_address').isLength({ min:3,max:250}),
  check('present_address').isLength({ min:3,max:250})
], async (req, res) => {	
	//console.log(req.body,'req-----innnn--'); 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
	  //res.status(422)
     res.json({ status:422,errors: errors.array() });
  }else{
	  //console.log(req.body);
	  	let email_exist = await ApiModel.CheckEmailAvailable(req.body.email);
	  	if(email_exist>0){
	  		res.json({ status:403,message:'Email has already registered'});
	  	}else{
	  		let date_of_birth = new Date(req.body.date_of_birth);
	  		let date_of_join = new Date(req.body.date_of_join);

	  		let emp_info = {name:req.body.name,gender:req.body.gender,position:req.body.position,level:req.body.level,email:req.body.email,dob:req.body.date_of_birth,doj:req.body.date_of_join,blood_group:req.body.blood_group,phone:req.body.phone,emergency_contact:req.body.emergency_contact,project_manager:req.body.project_manager,manager_n_plus:req.body.project_manager_n_plus,permanent_address:req.body.permanent_address,present_address:req.body.present_address,created_at:new Date()};

	  		let insert_emp = await ApiModel.InsertEmployee(emp_info);

	  		res.json({ status:200,message:'Employee added successfully'});

	  	}	
  }   
});

router.get('/get-sample-xl', function(req, res){
  let sample_file = './server/public/download/sample.xlsx';
  res.download(sample_file); // Set disposition and send it.
});


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = router;
