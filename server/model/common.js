var mongo = require('mongodb');
var db = require('../config/dbconnection');

exports.BillType = (bill_response)=> {	
	return new Promise( (resolve, reject) => {
		var response = bill_response;
		//console.log(bill_response,'bill_response',response,'response');
		var bill_type=0;
		if(response.payload.length > 0 && response.payload[0].displayName && response.payload[0].classification.score){		
		  if(response.payload[0].classification.score >= 0.8){			  
			  if(response.payload[0].displayName=='FuelBill'){
				  bill_type = 1;
				  console.log(1,'BillType');				  
			  }else if(response.payload[0].displayName=='TollBill'){
				  bill_type = 2;
				  console.log(2,'BillType');				 
			  }else{ bill_type = 3; }
		  }else{
			bill_type = 3;	
		  }			  
		}else{
			bill_type = 3;
			console.log(3,'BillType');			
		}
		//console.log(bill_type,'BillType');
		resolve(bill_type);
	})	
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validatePhone(phone) {
  var re = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  return re.test(phone);
}

