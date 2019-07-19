var express = require('express');
var router = express.Router();
//const multer = require('multer');
//const upload = multer();
var path = require('path');
const XLSX = require('xlsx');
var fs = require('fs');
var uniqid = require('uniqid');
const config = require('config');

const xlFolderPath = config.get('generalConfig.xlxsFolderPath');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//upload.array()
router.post('/upload-employee-xlxs', (req, res, next) => {
	
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

			  employeeFile.mv(uploadPath, function(err) {
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
						console.log(xl_json[i]);
						xl_json[i].created_at = created_at;					  						  
						let dob_val = xl_json[i].dob;
						delete xl_json[i].dob;
						console.log(dob_val,'dob_val');						
						let dob_obj = new Date(1900, 0, dob_val); //date-formatted columns (such as 11/4/14) it gives it a value of 41947
						if(typeof dob_val == 'number' && dob_obj && dob_obj !== null){
							console.log(dob_obj,'dob_obj');
							xl_json[i].dob=dob_obj;
						}else{
							console.log(dob_obj,'dob_obj--else');
						}
					}					
					res.json({ status:200,data:xl_json});	
				}		
			  })
		}else{
			res.json({ status:403,message:'Send valid file'});
		}
	}else{
		res.json({ status:403,message:'file not found'});
	}
  
});

router.get('/get-sample-xl', function(req, res){
  let sample_file = './public/download/sample.xlsx';
  res.download(sample_file); // Set disposition and send it.
});


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = router;
