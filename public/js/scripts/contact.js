(function ($) {
    $(document).ready(function () {
        var form    = $('#js-contact-form');
        var error   = form.find('.error');
        var success = form.prev('.success')

        // Reset contact form
        $('#js-dialog-contact-chk').change(function () {
            if ($(this).is(':checked')) {
                form.find('input, textarea').val('');
                error.hide();
                success.hide();
            }
        });

        // Send message
        $("#js-btn-send").click(function () {
            var form = $('#js-contact-form');

            // Hide message, errors
            error.hide();
            success.hide();

            // Send message
            $.post("/contact", form.serialize())
                .done(function (response) {
                    if (response.error) {
                        error.html(response.message).show();
                    }
                    if (response.success) {
                        form.hide();
                        success.html(response.message).show();
                    }
                })
                .fail(function () {
                    error.html('').show();
                })
        });
    });

})(jQuery);