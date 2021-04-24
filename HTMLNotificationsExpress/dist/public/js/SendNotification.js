"use strict";
$(document).on("ready", function () {
    console.log("doc ready");
    var recipient;
    var from;
    var message;
    var imgurl;
    $("#submitNotification").on("click", function () {
        recipient = $("#recipientEntry").val();
        from = $("#senderEntry").val();
        message = $("#messageEntry").val();
        imgurl = $("#imgUrlEntry").val();
        $.post("http://localhost:3000/sendNotification", { Recipient: recipient, From: from, Message: message, ImgUrl: imgurl }, function (data) { });
    });
});
