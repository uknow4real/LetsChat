let today = new Date();
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date+' '+time;
jQuery(document).ready(function() {

    $("#submit").click(function(e) {
        e.preventDefault();

        console.log($("#question").val())

        $.ajax({
            type: "POST",
            url: "./chatbot",
            data: {
                question: $("#question").val()
            },
            success: function(result) {
            $("#messages").append(`
                <div class="d-flex justify-content-end mb-4">
                    <div class="img_cont_msg">
                        <i class="fas fa-user"></i>
                    </div>
                
                    <div class="msg_cotainer">`+$("#question").val()+`                            
                        <span class="msg_time">`+dateTime+`</span>
                    </div>
                </div>
                <div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer_send">`+result.response+`
                        <span class="msg_time_send">`+dateTime+`</span>
                    </div>
                    <div class="img_cont_msg">
                        <img src="">
                    </div>
                </div>
            `);
            $("#question").val("")
            },
            error: function(result) {
                alert('error');
            }
        });

    });

});