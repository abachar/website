(function ($) {
    $(document).ready(function () {
        var form  = $('#js-comment-form');
        var error = form.find('.error');

        // Send message
        form.find(".js-btn-send").click(function () {
            // Hide errors
            error.hide();

            // Send message
            $.post(form.attr("action"), form.serialize())
                .done(function (response) {
                    if (response.error) {
                        error.html(response.message).show();
                    }
                    if (response.success) {
                        location.reload();
                    }
                })
                .fail(function () {
                    error.html('').show();
                })
        });

        // Hide errors
        error.hide();
    });

})(jQuery);