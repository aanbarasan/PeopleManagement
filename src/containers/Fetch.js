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
    xhr.open(props.method, props.url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.timeout = props.timeout ? props.timeout : 180000;
    xhr.ontimeout = function() {
      if(props.onTimeout){
        props.onTimeout();
      }
    };
    let json;
    if(props.body){
      json = JSON.stringify(props.body);
    }
    xhr.send(json);
  }
  
  let url = "http://localhost:3001";
  const Fetch = {

    uploadBulkData: function(props) {
        props.url = url + "/manage/upload-bulkdata";
        props.method = "GET";
        fetchData(props);
    }
  }
  
  export default Fetch;
  