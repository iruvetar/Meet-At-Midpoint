var airportMap = {};
// add a item
airportMap["ATL"] = "ATL airport";
airportMap["LAX"] = "LAX airport";
airportMap["ORD"] = "ORD airport";
airportMap["DFW"] = "DFW airport";
airportMap["JFK"] = "JFK airport";
airportMap["DEN"] = "DEN airport";
airportMap["SFO"] = "SFO airport";
airportMap["LAS"] = "LAS airport";
airportMap["SEA"] = "SEA airport";
airportMap["PIT"] = "PIT airport";
airportMap["SJC"] = "SJC airport";


$(document).ready(function(){
//    $("#alertMessage").hide();
    $("#searchButton").on('click', scrollToMap);
    $(".dropdown-item").on('click', changeButtonText);
})

function scrollToMap() {
    var place1 = $(".dropdown-toggle").first().text();
    var place2 = $(".dropdown-toggle").last().text();
    if (place1.search("Depart From") != -1 || place2.search("Depart From") != -1) {
//    $("#alertMessage").show();
    alert("At least one location is missing!");
        return;
    } else if (place1 == place2) {
        alert("Hey you guys actually depart from the same place?");
    } else {
        $("#alertMessage").hide();
//        event.preventDefault();
        mapReset(place1, place2);
        var targetOffset = $('#googleMap').offset().top;
        $("html, body").animate({
        scrollTop: targetOffset + "px"
        },1000);
    }
    
}
function mapReset(p1, p2) {
    console.log(p1 + " " + p2);
    var prefix = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD3eFiCwJPtgcaTbOE2Y4PWkL2FQqzWnQg&origin=";
    var middle = "&destination=";
    var end = "&mode=flying";
    $("iframe").attr('src', prefix + airportMap[p1] + middle + airportMap[p2] + end);
}
function changeButtonText() {
    var destination = this.value;
    $(this).parent().prev().text(destination);
}