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



function activateWaypointsAnimations( items, trigger ) {
  items.each( function() {
    var element = $(this),
    osAnimationClass = element.data("animation"),
    osAnimationDelay = element.attr('data-animation-delay');

    element.addClass("animate__animated");

    element.css({
        '-webkit-animation-delay':  osAnimationDelay,
        '-moz-animation-delay':     osAnimationDelay,
        'animation-delay':          osAnimationDelay
    });

    var trigger = ( trigger ) ? trigger : element;

    trigger.waypoint(function() {
        element.addClass('animated').addClass(osAnimationClass);
    },{
        offset: '80%'
    });
  });
}



$(document).ready(function () {
  if (jQuery) {
    // scroll to animate
    activateWaypointsAnimations($('.section-scroll-animate'));

  //   $('.section-scroll-animate').waypoint({
  //     handler: function (direction) {
  //       if (debug) {
  //         console.log("section animate when scroll -> direction", direction, this)
  //       }
  //       if (direction === 'down') {
  //         var container = $(this);

  //         var left = container.children(".animate-left");
  //         var right = container.children(".animate-right");

  //         right.addClass("animate__animated animate__slideInRight")
  //         left.addClass("animate__animated animate__slideInLeft")
  //         console.log("right", right)
  //         console.log("left", left)

  //         container.addClass('animate__animated animate__fadeInLeft');

  //       }
  //     }
  //   },{
  //      offset: '80%'
  //  });


    // Counters
    var mainCounter = $('.counter');

    var postURL = "https://mercury.alchemist.gold/waitinglist";

    $.get(postURL, function (data) {

      mainCounter.html(data.size);
      mainCounter.counterUp({
        delay: 10,
        time: 1000
      });

    });



    $('.counter').addClass('animated fadeInDownBig');

    // rules slider
    var animateRules = function (e) {
      if (debug) {
        console.log("animateRules -> e", e)
      }

      this.index = e.item.index;
      this.stage = $(e.currentTarget).find(".owl-stage")

      if (this.stage.length == 0) {
        return;
      } else {
        this.stage = this.stage[0];
      }

      this.ruleChildren = $(this.stage).children()
      this.rule = this.ruleChildren.eq(this.index)

      this.image = this.rule.find('.featured-image')
      this.ruleType = this.rule.find('.rules-content')
      this.example = this.rule.find('.example')

      this.image.addClass('animate__animated animate__tada')
      this.ruleType.addClass('animate__animated animate__bounceIn')
      this.example.addClass('animate__animated animate__fadeIn')

      var image = this.image;
      var ruleType = this.ruleType;
      var example = this.example;

      setTimeout(function () {
        image.removeClass('animate__animated animate__tada')
        ruleType.removeClass('animate__animated animate__bounceIn')
        example.removeClass('animate__animated animate__fadeIn')
      }, 1000);
    }

    var sliderSlickRules =
      $('#slider-rules').owlCarousel({
        items: 2,
        margin: 100,
        loop: true,
        center: true,
        URLhashListener: true,
        autoplayHoverPause: true,
        startPosition: 'URLHash',
        autoplay: true,
        autoplayTimeout: 5000,
        onChanged: function (e) {
          return animateRules(e);
        },
        responsiveClass: true,
        responsive: {
          0: {
            items: 1,
            margin: 100,
          },
          // 576: {
          //   items: 1,
          //   margin: 100,
          // },
          768: {
            items: 2,
            margin: 100,
          },
          // 992: {
          //   items: 2,
          //   margin: 100,
          // },
          // 1200: {
          //   items: 2,
          //   margin: 100,
          // }
        }
      });



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
    var postCaForm = function (form, serialized, cbSuccess, cbError) {
      if (debug) {
        console.log("postCaForm -> form", form)
        console.log("postCaForm -> serialized", serialized)
      }
      const urlParams = new URLSearchParams(serialized);
      const entries = urlParams.entries();
      var params = paramsToObject(entries);
      if (params.name == "empty") {
        params.name = params.email;
      }
      params.updates = params.hasOwnProperty("updates") && params.updates === "on" ? true : false;
      // zapier hook
      // var hook = "https://hooks.zapier.com/hooks/catch/7118809/ogojvwh/";
      // $.post(hook, params).then(function (response) {
      //     console.log("postCaForm -> response", response)
      //     alert("Thank you!");
      //     cbSuccess();
      // });

      $.post(postURL, params, function (data) {
          cbSuccess();
        })
        .fail(function (data) {
          if (data.status === 422 || data.status === 409) {
            cbError("You’re already on the waiting list.")
          } else {
            cbError("Ups something went wrong, please contact support.");
          }
        })
        .always(function () {});
    }

    var inputListener = function () {
      return this._caJoinInline.find(".indicator")[0].setAttribute("data-content", "For submit hit enter");
    }

    var inputListenerReset = function () {
      $(this._caJoinInline.find(".loader")[0]).removeClass("done")
      $(this._caJoinInline.find(".indicator")[0]).removeClass("done error")
      $(this._caJoinInline.find("input")[0]).removeClass("full")
      return true;
    }

    $("#ca-join-form-inline, #ca-join-form-inline-footer").each(function () {
      var caJoinInline = $(this);

      caJoinInline.click(inputListenerReset.bind({
        _caJoinInline: caJoinInline
      }));

      caJoinInline.find("input")[0].addEventListener("input", inputListener.bind({
        _caJoinInline: caJoinInline
      }));

      caJoinInline.submit(function (e) {
        e.preventDefault();
        var $form = $(this);

        $form.find(".indicator")[0].setAttribute("data-content", "Saving...")
        $($form.find("input")[0]).addClass("full")

        const postSubmitCB = function () {
          var currentCounter = parseInt(mainCounter.text()) + 1;

          mainCounter.html(currentCounter.toString());
          mainCounter.counterUp({
            delay: 10,
            time: 1000
          });


          $form.find(".indicator")[0].setAttribute("data-content", "Thank you! You're pioneer number " + currentCounter + ". We'll let you know when we launch!");
          $($form.find(".loader")[0]).addClass("done")
          $($form.find("input")[0]).addClass("full")
          $($form.find("input")[0]).val("")

          mainCounter.addClass("joinned")

        }

        const postSubmitErrorCB = function (errorMessage) {
          $form.find(".indicator")[0].setAttribute("data-content", errorMessage)
          $($form.find(".indicator")[0]).addClass("error")
          // $($form.find("input")[0]).addClass("full")
          // $($form.find("input")[0]).val("")
        }

        postCaForm($form, $form.serialize(), postSubmitCB, postSubmitErrorCB);
      });
    })



    // Modal form
    $("#ca-join").find("#ca-join-form").submit(function (e) {
      e.preventDefault();
      var $form = $(this);
      postCaForm($form, $form.serialize(), function () {
          $('#ca-join').modal('toggle');
        },
        function (errorMessage) {
          alert(errorMessage);
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
          if (this.objGoal.progress === 0) {
            this.content.removeClass('completed');
            this.goalBar.removeClass('completed');
            this.goalBar.removeClass('blink_me');
            this.content.removeClass('animate__animated animate__headShake');
          }

          if (this.objGoal.progress === 100) {
            this.content.addClass('completed');
            this.goalBar.addClass('completed');
            this.goalBar.addClass('blink_me');
            this.content.addClass('animate__animated animate__headShake');
          }

        }).bind(this))
      });
      cleanOthers(this.goalChildren, this.index);
    }


    var owl = $(".owl-carousel");
    owl.owlCarousel({
      items: 2,
      loop: true,
      margin: 0,
      autoplay: true,
      autoplayTimeout: 2000,
      lazyLoad: true,
      mouseDrag: false,
      responsive: {
        350: {
          items: 1
        },
        400: {
          items: 2
        },
        600: {
          items: 2
        }
      },
      nav: false,
      dots: false,
      drag: false,
      center: true,
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
        autoplaySpeed: 3000,
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
