"use strict";

$(document).ready(function () {
    var url = location.href.replace(/\/$/, "");
    console.log('url cliqued...',url);
    console.log('location cliqued...',location);
    if (location.hash) {
        var hash = url.split("#");
        $('#myTab a[href="#' + hash[1] + '"]').tab("show");
        url = location.href.replace(/\/#/, "");
        history.replaceState(null, null, url);
    }

    $('a[data-toggle="tab"]').on("click", function () {
        var newUrl;
        var hash = $(this).attr("href");

        if (hash == "#tab-content-10") {
            newUrl = url.split("#")[0] + "/perfil";
        } else if (hash == "#tab-content-11") {
            newUrl = url.split("#")[0] + "/recerca";
        } else if (hash == "#tab-content-12") {
            newUrl = url.split("#")[0] + "/publicacions";
        } else if (hash == "#tab-content-13") {
            newUrl = url.split("#")[0] + "/docencia";
        } else if (hash == "#tab-content-14") {
            newUrl = url.split("#")[0] + "/difusio";
        } else if (hash == "#tab-content-15") {
            newUrl = url.split("#")[0] + "/contacte";
        } else {
            newUrl = url.split("#")[0] + hash;
        }

        newUrl += "/";
        history.replaceState(null, null, newUrl);
    });
});