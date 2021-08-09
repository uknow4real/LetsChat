let today = new Date();
let date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
let time = today.getHours() + ":" + today.getMinutes();
if (today.getMinutes() < 10) {
    time = today.getHours() + ":0" + today.getMinutes();
}
jQuery(document).ready(function() {
    $('.date').append('<span>' + date + '</span>')
        // chatbot first message - greeting to the user
    $.ajax({
        type: "POST",
        url: "./chat",
        data: {
            question: "hello"
        },
        beforeSend: function() {
            $("#messages").append(`
            <div id="type_dots">
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg mr-2">
                        <img src="/static/img/chatbot_icon.png" class="rounded-circle user_img_msg" id="bot_icon">
                    </div>
                    <div class="msg_cotainer_send">
                        <img class="typing_dots" src="/static/img/ellipse-dots.gif">
                    </div>
                </div>
            </div>
            `);
        },
        success: function(result) {
            $('#type_dots').remove();
            $("#messages").append(`
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg mr-2">
                        <img src="/static/img/chatbot_icon.png" class="rounded-circle user_img_msg" id="bot_icon">
                    </div>
                    <div class="msg_cotainer_send">` + result.response + `
                        <span class="msg_time_send">` + time + `</span>
                    </div>
                </div>
            `);
        },
        error: function(result) {
            console.log("chatbot error");
        }
    });

    $('textarea').keypress(function(e) {
        let key = e.which;
        if (key == 13) { // enter key code
            chat();
        }
    });

    $("#submit").click(function(e) {
        e.preventDefault();
        chat();
    });
});

function chat() {
    $.ajax({
        type: "POST",
        url: "./chat",
        data: {
            question: $("#question").val()
        },
        beforeSend: function() {
            $("#messages").append(`
            <div id="type_dots">
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg mr-2">
                        <img src="/static/img/chatbot_icon.png" class="rounded-circle user_img_msg" id="bot_icon">
                    </div>
                    <div class="msg_cotainer_send">
                        <img class="typing_dots" src="/static/img/ellipse-dots.gif">
                    </div>
                </div>
            </div>
            `);
        },
        success: function(result) {
            $('#type_dots').remove();
            $("#messages").append(`
                <div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer">` + $("#question").val() + `                            
                        <span class="msg_time">` + time + `</span>
                    </div>
                    <div class="img_cont_msg ml-2 rounded-circle user_img_msg">
                        <img src="/static/img/user_icon.png" class="" id="user_icon">
                    </div>
                </div>
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg mr-2">
                        <img src="/static/img/chatbot_icon.png" class="rounded-circle user_img_msg" id="bot_icon">
                    </div>
                    <div class="msg_cotainer_send">` + result.response + `
                        <span class="msg_time_send">` + time + `</span>
                    </div>
                </div>
            `);
            $("#question").val("")
            autoScroll();
        },
        error: function(result) {
            $('#type_dots').remove();
            $("#messages").append(`
                <div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer">` + $("#question").val() + `                            
                        <span class="msg_time">` + time + `</span>
                    </div>
                    <div class="img_cont_msg ml-2 rounded-circle user_img_msg">
                        <img src="/static/img/user_icon.png" class="" id="user_icon">
                    </div>
                </div>
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg mr-2">
                        <img src="/static/img/chatbot_icon.png" class="rounded-circle user_img_msg" id="bot_icon">
                    </div>
                    <div class="msg_cotainer_send">Sorry, I don't know what you mean by that.
                        <span class="msg_time_send">` + time + `</span>
                    </div>
                </div>
            `);
            $("#question").val("")
            autoScroll();
        }
    });
}

function autoScroll() {
    // auto scroll to the last message
    let container = document.querySelector('#messages');
    container.maxScrollTop = container.scrollHeight - container.offsetHeight;
    if (container.maxScrollTop - container.scrollTop <= container.offsetHeight) {
        container.scrollTop = container.scrollHeight;
    }
}