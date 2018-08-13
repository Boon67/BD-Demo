function updateDataFromMQTT(req, resp) {
  log(req);
  ClearBlade.init({request:req});
  var splitString = req.params.body.split("//");
  if(splitString.length!=2){
    resp.error("Invalid message from MQTT trigger: " + req.params.body);
    return;
  }
  var deviceId = splitString[0];
  var message = splitString[1];
  var collection = ClearBlade.Collection({collectionName: "EndpointData"});
  var query = ClearBlade.Query();
  query.equalTo('deviceid', deviceId);
  var createCallback = function (err, data) {
      if (err) {
      resp.error("create error : " + JSON.stringify(data));
      } else {
        resp.success(data);
      }
  };
  var updateCallback = function (err, data) {
      if (err) {
      resp.error("update error : " + JSON.stringify(data));
      } else {
        resp.success(data);
      }
  };
  var countCallback = function(err, data){
    if(err){
      resp.error("count error: " + JSON.stringify(data));
    }
    if(data.count<1){
      collection.create({
        deviceid: deviceId,
        message: message
      }, createCallback);
    }else{
      collection.update(query, {
        message: message
      }, updateCallback);
    }
  }
  collection.count(query, countCallback);
}
