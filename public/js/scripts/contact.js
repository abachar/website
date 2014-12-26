(function ($) {
    $(document).ready(function () {
        var dialog = $('#js-contact-dialog');
        var form = dialog.find('form');
        var error = dialog.find('.error');
        var success = dialog.find('.success')

        // Reset contact form
        $('#js-dialog-contact-chk').change(function () {
            if ($(this).is(':checked')) {
                form.find('input, textarea').val('');
                error.hide();
                success.hide();
            }
        });

        // Send message
        dialog.find(".js-btn-send").click(function () {

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