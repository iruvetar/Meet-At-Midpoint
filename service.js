var airportMap = {};
// add a item
airportMap.ATL = 'ATL airport';
airportMap.LAX = "LAX airport";
airportMap.ORD = "ORD airport";
airportMap.DFW = "DFW airport";
airportMap.JFK = "JFK airport";
airportMap.DEN = "DEN airport";
airportMap.SFO = "SFO airport";
airportMap.LAS = "LAS airport";
airportMap.SEA = "SEA airport";
airportMap.PIT = "PIT airport";
airportMap.SJC = "SJC airport";

function JsonCallback(data) {
    console.log(data);
    console.log(data.response.length);
    for ( i = 0; i < 4; i++) {
	console.log(data.response[i]);
    }
}

function ajaxCallJsonp (target) {
    //get request
    var data = $.getJSON(target,
    {
        lat: "41",
        lng: "-102",
        distance: "100"
    }, JsonCallback);
    
    //empty content
//    $(".response-area").html("");
//    console.log(data);
//    console.log(data[responseJSON]);
//    for ( i = 0; i < 4; i++) {
//	console.log(data.responseJSON.response[i]);
//    }
    //get data successfully
//    data.success(function (msg) {
//        $.each(msg.items, function (i,item) {
//            
//            $("#response-area").html();
//            
//            $("#response-area").append();
//            
//            if ( i == 3) {
//                return false;
//            }
//        });
//    });
//    
//    data.error(function (msg) {
//        $("#response-area").html("fail getting data");
//    });
    
}

function scrollToMap() {
    var place1 = $(".dropdown-toggle").first().text(), place2 = $(".dropdown-toggle").last().text();
    if (place1.search("Depart From") !== -1 || place2.search("Depart From") !== -1) {
//    $("#alertMessage").show();
    alert("At least one location is missing!");
        return;
    } else if (place1 === place2) {
        alert("Hey you guys actually depart from the same place?");
    } else {
        $("#alertMessage").hide();
//        event.preventDefault();
        mapReset(place1, place2);
        var targetOffset = $('#googleMapFrame').offset().top;
        $("html, body").animate({
        scrollTop: targetOffset + "px"
        }, 1000);
    }
    
}
function searchFunctions () {
    $("#googleMapFrame").ready(scrollToMap);
}
function mapReset (p1, p2) {
    console.log(p1 + " " + p2);
    var prefix = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD3eFiCwJPtgcaTbOE2Y4PWkL2FQqzWnQg&origin=";
    var middle = "&destination=";
    var end = "&mode=flying";
    $("#googleMapFrame").attr('src', prefix + airportMap[p1] + middle + airportMap[p2] + end);
}
function changeButtonText() {
    var destination = this.value;
    $(this).parent().prev().text(destination);
}

$(document).ready(function () {
//    $("#alertMessage").hide();
    $("#searchButton").on('click', searchFunctions);
    $("#searchButton").click(function(){
        ajaxCallJsonp("https://iatacodes.org/api/v6/nearby.jsonp?&callback=?&api_key=f7d540ed-9d7c-4419-8f88-35d8bddbfc5d");
    });
    $(".dropdown-item").on('click', changeButtonText);

});