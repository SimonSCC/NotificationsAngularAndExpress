"use strict";
$(document).on("ready", function () {
    console.log("doc ready");
    var from;
    var message;
    var imgurl;
    $("#submitNotification").on("click", function () {
        from = $("#fromEntry").val();
        message = $("#messageEntry").val();
        imgurl = $("#imgUrlEntry").val();
        $.post("http://localhost:3000/sendNotification", { From: from, Message: message, ImgUrl: imgurl }, function (data) { });
    });
});
