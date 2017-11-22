//Handle button events
//Some event listeners
$(document).ready(function() {
    
    $("#createBton").on('click', create);
    $("#getBton").on('click', retrieve);
    $("#updateBton").on('click', update);
    $("#deleteBton").on('click', remove);
});
function tripResponse(res) {
    if (!res) {
        $("#responseArea").html("This trip is either deleted or never exist");
    } else {
        var jsonObj = JSON.parse(res);
        var text = "Trip name: <b>" + jsonObj.name + "</b><br><br>From <b>" + jsonObj.dep + "</b><br>To <b>" + jsonObj.des + "</b><br><br>Depart on <b>" + jsonObj.dDate + "</b>, return on <b>" + jsonObj.rDate + "</b><br>";
        $("#responseArea").html(text);
    }
    
}
function create() {
    console.log("create");
    
    //the places and date selected by the user
    var query = $('#createForm').find('input[name="trip"]').val();
    query = query + '/' + $('#createForm').find('input[name="depart"]').val();
    query = query + '/' + $('#createForm').find('input[name="destination"]').val();
    query = query + '/' + $('#createForm').find('input[name="dDate"]').val();
    query = query + '/' + $('#createForm').find('input[name="rDate"]').val();
    
    
    //for the Ajax request
    var xhr = new XMLHttpRequest();
    //trip/:name/:depart/:to/:fromDate/:toDate
    var path = 'trip/' + query;
    xhr.open('PUT', path,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.send();
    xhr.onload = function() {
        console.log('Put request done');
    // process the response.
//     tripResponse(xhr.responseText);
        $("html").html(xhr.responseText);
    };
    xhr.onerror = function() {
      console.log('There was an error');
    };

}

var retrieve = function() {
    console.log("retrieve");
    
    //the name of the trip
    var query = $('#retrieveForm').find('input[name="trip"]').val();
    
    //for the Ajax request
    var xhr = new XMLHttpRequest();
    //trip/:name
    var path = 'trip/' + query;

    xhr.open('GET', path,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.send();
    xhr.onload = function() {
    // process the response.
      $("html").html(xhr.responseText);
    };
    xhr.onerror = function() {
      console.log('There was an error');
    };
}

var update = function() {
    
    console.log("update");

    //the places and date selected by the user
    var n = $('#updateForm').find('input[name="trip"]').val();
    var dep = $('#updateForm').find('input[name="depart"]').val();
    var des = $('#updateForm').find('input[name="destination"]').val();
    var ndd = $('#updateForm').find('input[name="dDate"]').val();
    var nrd = $('#updateForm').find('input[name="rDate"]').val();
    
    
    var queryBody = "find={\"name\":\"" + n;
    queryBody += "\", \"dep\":\"" + dep;
    queryBody += "\", \"des\":\"" + des;
    queryBody +="\"}&update={\"$set\":{\"";
    queryBody += "dDate\":\"" + ndd;
    queryBody += "\", \"rDate\":\"" + nrd;
    queryBody += "\"}}";
    
    console.log(queryBody);
//    query["find"] find={"name":$('#updateForm').find('input[name="trip"]').val(), "dep":$('#updateForm').find('input[name="depart"]').val(), "des": $('#updateForm').find('input[name="destination"]').val()}&update={"$set":{"leaves":"green"}}
    

    //for the Ajax request
    var xhr = new XMLHttpRequest();
    //trip/:name/:depart/:to/:fromDate/:toDate
    var path = 'trip/';
    xhr.open('POST', path, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.send(queryBody);
    xhr.onload = function() {
    // process the response.
     $("html").html(xhr.responseText);
    };
    xhr.onerror = function() {
      console.log('There was an error');
    };
}

var remove = function() {
    console.log("Delete");
    
    //the places and date selected by the user
    var query = $('#deleteForm').find('input[name="trip"]').val();
    
    //for the Ajax request
    var xhr = new XMLHttpRequest();
    //trip/:name
    var path = 'trip/' + query;
    xhr.open('DELETE', path,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.send();
    xhr.onload = function() {
    // process the response.
     $("html").html(xhr.responseText);
    };
    xhr.onerror = function() {
      console.log('There was an error');
    };
}