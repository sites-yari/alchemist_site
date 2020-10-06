// var myStepper;
window.debug = false;

function paramsToObject(entries) {
  let result = {}
  for (let entry of entries) {
    const [key, value] = entry;
    result[key] = value;
  }
  return result;
}

$(document).ready(function () {
  if (jQuery) {
    // faq page
    $('li strong').click(function (e) {
      e.preventDefault(); // disable text selection
      $(this).parent().find('em').slideToggle('medium', function () {
        if ($(this).is(':visible')) {
          $(this).css('display', 'inline-block');
        }
      });
      return false;
    });

    $('#search').keyup(function (e) {
      var s = $(this).val().trim().toLowerCase();
      if (s === '') {
        $('.group-topics li').each(function () {
          $(this).show();
          $('.group').show();
        });
      }

      $('.group-topics li').filter(function () {
        var reg = new RegExp(s, "g");
        var elem = $(this);
        console.log("elem", elem)
        reg.test(elem.text().toLowerCase()) ? elem.show() : elem.hide();
      })

      // hide title on topics
      $('.group-topics').each(function () {
        var group = $(this);

        if ($(':visible', group).length == 0) {
          group.siblings().hide();
          group.parent().hide();
        } else {
          group.parent().show();
          group.siblings().show();
        }
      })

      return true;
    });


    $("#search").on('focus', function () {
      $(this).parent('label').addClass('active');
    });


    $("#search").on('blur', function () {
      if ($(this).val().length == 0)
        $(this).parent('label').removeClass('active');
    });

    // tabs terms page

    $('#terms-tab-nav-btn').on('click', function () {
      $(this).toggleClass('hide');
    });

    // inline forms
    var postCaForm = function (form, serialized, cb) {
      if (debug) {
        console.log("postCaForm -> form", form)
        console.log("postCaForm -> serialized", serialized)
      }
      const urlParams = new URLSearchParams(serialized);
      const entries = urlParams.entries();
      const params = paramsToObject(entries);
      if (params.name == "empty") {
        params.name = params.email;
      }
      // zapier hook
      // var hook = "https://hooks.zapier.com/hooks/catch/7118809/ogojvwh/";
      // $.post(hook, params).then(function (response) {
      //     console.log("postCaForm -> response", response)
      //     alert("Thank you!");
      //     cb();
      // });

      $.post(form.attr("action"), (new URLSearchParams(params)).toString()).then(function () {
        alert("Thank you!");
        cb();
      }).catch(function (error) {
        if (debug) {
          console.error("post form: ", error)
        }

        setTimeout(() => {
          cb();
        }, 3000);
      });


    }

    var inputListener = function () {
      return this._caJoinInline.find(".indicator")[0].setAttribute("data-content", "For submit hit enter");
    }

    $("#ca-join-form-inline, #ca-join-form-inline-footer").each(function () {
      var caJoinInline = $(this);
      caJoinInline.find("input")[0].addEventListener("input", inputListener.bind({
        _caJoinInline: caJoinInline
      }));

      caJoinInline.submit(function (e) {
        e.preventDefault();
        var $form = $(this);

        $form.find(".indicator")[0].setAttribute("data-content", "Saving...")
        $($form.find("input")[0]).addClass("full")

        const postSubmitCB = function () {
          $form.find(".indicator")[0].setAttribute("data-content", "You've been subscribed!")
          $($form.find(".loader")[0]).addClass("done")
          $($form.find("input")[0]).addClass("full")
          $($form.find("input")[0]).val("")
        }
        postCaForm($form, $form.serialize(), postSubmitCB);
      });
    })





    // Modal form
    $("#ca-join").find("#ca-join-form").submit(function (e) {
      e.preventDefault();
      var $form = $(this);
      postCaForm($form, $form.serialize(), function () {
        $('#ca-join').modal('toggle');
      });
    });


    // owl-carousel
    var cleanOthers = function (parent, currentIndex) {
      const totalItems = parent.length
      for (var i = 0; i < totalItems; i++) {
        const element = parent[i];
        if (currentIndex !== i && (currentIndex - 1) !== i) {
          var goal = $(element);
          var goalSaved = goal.find('.variable')
          var goalBar = goal.find('.progress-bar')
          var content = goal.find('.content-saved')
          goalSaved[0].innerHTML = "0";
          goalBar[0].innerHTML = "0";
          goalBar[0].style.setProperty('--progress', 0);

          content.removeClass('completed');
          goalBar.removeClass('completed');
        }
      }
    }

    var animate = function (e) {
      this.index = e.item.index;
      this.stage = $(e.currentTarget).find(".owl-stage")

      if (this.stage.length == 0) {
        return;
      } else {
        // select first child
        this.stage = this.stage[0];
      }

      // var goalWrp = $('figure.goal-wrp');
      this.goalChildren = $(this.stage).children()
      this.goal = this.goalChildren.eq(this.index) // $('.owl-item.active.center')

      if (goal.length === 0) {
        return;
      }
      this.content = goal.find('.content-saved')
      this.goalSaved = goal.find('.variable')
      this.goalTotal = goal.find('.total')
      this.goalBar = goal.find('.progress-bar')

      this.objGoal = {
        charged: '0%',
        progress: 0,
      }

      this._total = parseInt(goalTotal[0].innerHTML)
      if (typeof (_total) != "number") {
        this._total = '100%';
      } else {
        this._total = this._total + '%';
      }

      anime({
        targets: objGoal,
        charged: _total,
        progress: 100,
        round: 1,
        easing: 'easeInOutExpo',
        duration: 1500,
        update: ((function () {
          this.goalSaved[0].innerHTML = JSON.stringify(parseInt(this.objGoal.charged));
          this.goalBar[0].innerHTML = JSON.stringify(parseInt(this.objGoal.charged));
          this.goalBar[0].style.setProperty('--progress', this.objGoal.progress);
          if (this.objGoal.progress === 100) {
            this.content.addClass('completed');
            this.goalBar.addClass('completed');
          }
        }).bind(this))
      });
      cleanOthers(this.goalChildren, this.index);
    }


    var owl = $(".owl-carousel");
    owl.owlCarousel({
      center: true,
      items: 3,
      loop: true,
      margin: 0,
      autoplay: true,
      autoplayTimeout: 2000,
      lazyLoad: true,
      mouseDrag: false,
      // responsive: {
      //     600: {
      //         items: 3
      //     }
      // },
      nav: false,
      dots: false,
      drag: false,
      onChanged: function (e) {
        return animate(e);
      }
    });


    var sliderSlick =
      $('.stepper-app')
      .on('init', function (slick) {
        $('.slick-dots').on('click', function () {
          $('.stepper-app').slick('slickPause');
        });
      }).slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        // cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 1000,
        arrows: false,
        appendDots: $("#stepper-wrp")[0],
        customPaging: function (slick, index) {
          return index + 1;
        }
      });


    sliderSlick.on('afterChange', function (event, slick, currentSlide, nextSlide) {
      if (debug == true) {
        console.log("event", event)
      }
    });


    $('#playPresentation').on('click', function () {
      if (debug == true) {
        console.log("playPresentation click")
      }
    })


    // // ================================== video

    // var $refreshButton = $('#refresh');
    // var $results = $('#css_result');

    // function refresh(){
    //   var css = $('style.cp-pen-styles').text();
    //   $results.html(css);
    // }

    // refresh();
    // $refreshButton.click(refresh);

    // // Select all the contents when clicked
    // $results.click(function(){
    //   $(this).select();
    // });
    // //===================================

    // // ====================================================== Sections data-bg
    // $("section.row-with-bg-1.data-bg").each(function (i) {
    //     // $(this).attr('style','background-image: url('+ imagesArray[i] +'));
    //     const elm = $(this);
    //     const elmAttrDataBg = elm.attr("data-bg");
    //     if (elmAttrDataBg.trim() !== "") {
    //         elm.css("background-image", "url(" + elmAttrDataBg + ")");
    //     }
    // });

    // $("section.row-with-bg-1.data-bg-color").each(function (i) {
    //     // $(this).attr('style','background-image: url('+ imagesArray[i] +'));
    //     const elm = $(this);
    //     const elmAttrDataBg = elm.attr("data-bg-color");
    //     if (elmAttrDataBg.trim() !== "") {
    //         elm.css("background-color", elmAttrDataBg);
    //     }
    // });
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

    $('a[data-modal]').on('click', function () {
      var $page = $(this).data('page');
      var $image = $(this).data('image');
      var $video = $(this).data('video');
      var $title = $(this).data('title');
      var $size = $(this).data('size');
      $('#quickview .modal-title').text($title);

      if ($size) {
        $('#quickview .modal-dialog').addClass('modal-' + $size);
      }
      if ($image) {
        $('#quickview .modal-body').html('<div class="text-center"><img class="img-fluid" src="' + $image + '" alt="' + $title + '"></div>');
      } else if ($video) {
        $('#quickview .modal-body').html('<div class="embed-responsive embed-responsive-21by9"><iframe src="https://player.vimeo.com/video/' + $video + '?color=ff9933&title=0&byline=0&portrait=0&autoplay=1&autopause=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>');
      }
      // < div class= "embed-responsive embed-responsive-16by9" > <iframe class="embed-responsive-item" src="https://www.youtube-nocookie.com/embed/'+$video+'?autoplay=1&theme=dark&controls=0&disablekb=0&rel=0&showinfo=0&modestbranding=1&color=red" allowfullscreen></iframe></div > ');
      if ($page) {
        $('#quickview .modal-body').load($page, function () {
          $('#quickview').modal({
            show: true
          });
        });
      } else {
        $('#quickview').modal({
          show: true
        });
      }
      $('#quickview').on('hidden.bs.modal', function () {
        $('#quickview .modal-title').text('');
        $('#quickview .modal-body').html('');
        if ($size) {
          $('#quickview .modal-dialog').removeClass('modal-' + $size);
        }
      });
    });
    // ====================================================== End Video actions

  } else {
    alert("Need javascript to run properly this page");
  }
});
