$(document).ready(function () {
    if (jQuery) {
        $('#carouselExampleIndicators').carousel({
            interval: 2000
        })
    } else {
        alert("Need javascript to run properly this page");
    }
});
