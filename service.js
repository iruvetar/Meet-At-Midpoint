$(document).ready(function(){
//    $("#alertMessage").hide();
    $("#searchButton").on('click', scrollToMap);
    $(".dropdown-item").on('click', changeButtonText);
})

function scrollToMap() {
    var place1 = $(".dropdown-toggle").first().text();
    var place2 = $(".dropdown-toggle").last().text();
    if (place1.search("Depart From") != -1 || place2.search("Depart From") != -1) {
    $("#alertMessage").show();
//    alert("At least one location is missing!");
        return;
    } else {
        $("#alertMessage").hide();
        console.log(place1 + " " + place2);
//        event.preventDefault();
        var targetOffset = $('#googleMap').offset().top;
        $("html, body").animate({
        scrollTop: targetOffset + "px"
        },1000);
    }
    
}

function changeButtonText() {
    var destination = this.value;
    $(this).parent().prev().text(destination);
}