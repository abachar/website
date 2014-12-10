(function ($) {
    $(document).ready(function () {

        // Reset contact form
        $('#js-dialog-contact-chk').change(function () {
            if ($(this).is(':checked')) {
                var form = $('#js-contact-form');
                form.find('input, textarea').val('');
                form.find('.errors').hide();
                form.prev('.success').hide();
            }
        });

        // Send message
        $("#js-btn-send").click(function () {
            var form = $('#js-contact-form');

            // Hide message, errors
            form.find('.errors').hide();
            form.prev('.success').hide();

            // Send message
            $.post("/contact", form.serialize())
                .done(function (response) {
                    if (response.error) {
                        form.find('.errors').html(response.message).show();
                    }
                    if (response.success) {
                        form.hide();
                        form.prev('.success').html(response.message).show();
                    }
                })
                .fail(function () {
                    form.find('.errors').html('').show();
                })
        });
    });

})(jQuery);