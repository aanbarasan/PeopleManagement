function fetchData(props) {
    if (props.method === "GET") {
      let url = props.url;
      if (props.body) {
        let keys = Object.keys(props.body);
        if (keys.length > 0) {
          url = url + "?";
          let dt = [];
          for (var i = 0; i < keys.length; i++) {
            dt.push(keys[i] + "=" + props.body[keys[i]]);
          }
          url = url + dt.join("&");
        }
      }
      props.url = url;
    }
  
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if(xhr.status === 200){
          let json = {};
          if(xhr.response){
            json= JSON.parse(xhr.response);
          }
          props.success(json);
        }
        else {
          if(props.error){
            props.error(xhr.response);
          }
          else{
            console.error(xhr.response);
          }
        }
      }
    };
    let async = true;
    if(typeof props.async === "boolean"){
      async = props.async;
    }
    xhr.open(props.method, props.url, async);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    if(async){
      xhr.timeout = props.timeout ? props.timeout : 180000;
      xhr.ontimeout = function() {
        if(props.onTimeout){
          props.onTimeout();
        }
      };
    }
    let json;
    if(props.body){
      json = JSON.stringify(props.body);
    }
    xhr.send(json);
  }
  
  let url = "http://localhost:3001/api";
  const Fetch = {

    globalURL: function(localUrl){
      return url + localUrl;
    },
    
    sumbitNewEmployee: function(props) {
        props.url = url + "/add-employee";
        props.method = "POST";
        fetchData(props);
    },
    
    getAllEmployee: function(props) {
        props.url = url + "/get-employees";
        props.method = "GET";
        fetchData(props);
    }
  }
  
  export default Fetch;
  