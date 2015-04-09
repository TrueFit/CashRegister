var File = (function () {
    var dropzoneContainer = function() { return $("[data-dropzone]"); };

    var exposed = {
        Initialize: function() {
            dropzoneContainer().dropzone({
                maxFilesize: 100,
                init: function () {
                    this.on("complete", function () {

                    });
                }
            });
        }
    };

    return exposed;
});