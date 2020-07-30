var myStepper;

$(document).ready(function () {
    if (jQuery) {
        // ================================== video

        var $refreshButton = $('#refresh');
        var $results = $('#css_result');
        
        function refresh(){
          var css = $('style.cp-pen-styles').text();
          $results.html(css);
        }
      
        refresh();
        $refreshButton.click(refresh);
        
        // Select all the contents when clicked
        $results.click(function(){
          $(this).select();
        });
        //===================================




        const stepper = $('section[data-stepper]');
        const stepperAutoPlay = $(stepper).data('autoplay') || false;
        const stepperTotal = $(stepper).data('total') || 1;
        const stepperDelay = $(stepper).data('delay') || 3000;
        const stepperId = $(stepper).attr('id');
        if (stepperAutoPlay) {
            myStepper = setInterval(myTimer, stepperDelay);
            var c = 0;
            function myTimer() {
                c += 1;
                if (c === stepperTotal) {
                    c = 0;
                }
                stepperShow(stepperId, c, false);
            }
        }

        // ====================================================== Sections data-bg
        $("section.row-with-bg-1.data-bg").each(function (i) {
            // $(this).attr('style','background-image: url('+ imagesArray[i] +'));
            const elm = $(this);
            const elmAttrDataBg = elm.attr("data-bg");
            if (elmAttrDataBg.trim() !== "") {
                elm.css("background-image", "url(" + elmAttrDataBg + ")");
            }
        });

        $("section.row-with-bg-1.data-bg-color").each(function (i) {
            // $(this).attr('style','background-image: url('+ imagesArray[i] +'));
            const elm = $(this);
            const elmAttrDataBg = elm.attr("data-bg-color");
            if (elmAttrDataBg.trim() !== "") {
                elm.css("background-color", elmAttrDataBg);
            }
        });
        // ====================================================== End Sections data-bg


        // ====================================================== Video actions
        // Set iframe attributes when the show instance method is called
        //  usage 
        //     <a href="javascript:;" class="btn btn-primary" data-modal data-video="0mHmrNdaiBY" data-title="Video Title"
        //     data-size="xl">Video</a>

        //   <a href="javascript:;" class="btn btn-primary" data-modal
        //     data-image="https://v4-alpha.getbootstrap.com/assets/brand/bootstrap-social-logo.png" data-title="Image Title"
        //     data-size="">Image</a>

        //   <a href="javascript:;" class="btn btn-primary" data-modal data-page="https://getbootstrap.com"
        //     data-title="Page Title" data-size="lg">Page *</a>

        $('a[data-modal]').on('click',function(){
            var $page = $(this).data('page');
            var $image = $(this).data('image');
            var $video = $(this).data('video');
            var $title = $(this).data('title');
            var $size = $(this).data('size');
            $('#quickview .modal-title').text($title);
            if ($size) { $('#quickview .modal-dialog').addClass('modal-'+$size); }
            if ($image) {
                $('#quickview .modal-body').html('<div class="text-center"><img class="img-fluid" src="'+$image+'" alt="'+$title+'"></div>');
            } else if ($video) {
                $('#quickview .modal-body').html('<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://www.youtube-nocookie.com/embed/'+$video+'?autoplay=1&theme=dark&controls=0&disablekb=0&rel=0&showinfo=0&modestbranding=1&color=red" allowfullscreen></iframe></div>');
            }
            if ($page) {
                $('#quickview .modal-body').load($page,function(){
                    $('#quickview').modal({show:true});
                });
            } else {
                $('#quickview').modal({show:true});
            }
            $('#quickview').on('hidden.bs.modal', function(){
                $('#quickview .modal-title').text('');
                $('#quickview .modal-body').html('');
                if ($size) { $('#quickview .modal-dialog').removeClass('modal-'+$size); }
            });
        });
        // ====================================================== End Video actions
        
    } else {
        alert("Need javascript to run properly this page");
    }
});

var stepperShow = function (stepper, stepIndex, stop = true) {
    if (stop) {
        clearInterval(myStepper);
    }
    const _rootStepperPath = "#" + stepper;
    // const _stepper = $(_rootStepperPath);

    const _mediaId = _rootStepperPath + "-media-" + stepIndex;
    const _mediaPath = _rootStepperPath + " " + _mediaId;
    const _media = $(_mediaPath);


    const _descriptionId = _rootStepperPath + "-desc-" + stepIndex;
    const _descriptionPath = _rootStepperPath + " " + _descriptionId;
    const _description = $(_descriptionPath);

    const _stepperButtonId = _rootStepperPath + "-step-button-" + stepIndex;
    const _stepperButtonPath = _rootStepperPath + " " + _stepperButtonId;
    const _stepperButton = $(_stepperButtonPath);


    // get childrens
    const childrenStepNavPath = _rootStepperPath + " .stepper-nav";
    var childrenStepNav = $(childrenStepNavPath).children();

    for (let i = 0; i < childrenStepNav.length; i++) {
        const element = childrenStepNav[i];
        $(element).removeClass('active');
    }
    _stepperButton.addClass("active");

    const childrenStepMediaPath = _rootStepperPath + " .content-wrp";
    var childrenStepMedia = $(childrenStepMediaPath).children();

    for (let i = 0; i < childrenStepMedia.length; i++) {
        const element = childrenStepMedia[i];
        $(element).removeClass('active');
    }
    _media.addClass("active");


    const childrenStepDescPath = _rootStepperPath + " #" + stepper + "-desc-wrp";
    var childrenStepDesc = $(childrenStepDescPath).children();

    for (let i = 0; i < childrenStepDesc.length; i++) {
        const element = childrenStepDesc[i];
        $(element).removeClass('active');
    }
    _description.addClass("active");

}
