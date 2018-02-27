(function($) {
	var CHINASTORIES = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {

			common: {
				go: function(topPos, speed, callback) {
					var curTopPos = $sel.window.scrollTop(),
						diffTopPos = Math.abs(topPos - curTopPos);
					$sel.body.add($sel.html).animate({
						"scrollTop": topPos
					}, speed, function() {
						if(callback) {
							callback();
						}
					});
				}
			},

			scrollAnimation: {
				blocks: [],

				init: function() {
					var self = this;

					$("[data-animationblock]:not(.animated)").each(function() {
						var $item = $(this),
							itemAnimation = $item.data("animationtype"),
							itemAnimationDuration = $item.data("animationduration");

						if (!itemAnimationDuration) {
							itemAnimationDuration = 0;
						}

						self.blocks.push({
							"html": $item,
							"top": $item.offset().top,
							"typeAnimation": itemAnimation,
							"animation-duration" : itemAnimationDuration
						});

						$item.addClass("before-" + itemAnimation);
						$item.css("animation-duration", itemAnimationDuration);

					});

					$sel.window.on("scroll", function() {
						self.check();
					});

					setTimeout(function() {
						self.check();
					}, 50);

					self.fixedBlock();
				},

				check: function() {
					var self = this,
						block = false,
						blockTop = false,
						top = $sel.window.scrollTop(),
						buffer = parseInt($sel.window.height()) / 1.8;
					for(var i = 0, len = self.blocks.length; i < len; i++) {
						block = self.blocks[i],
						blockTop = parseInt(block.top, 10);
						if(block.html.hasClass("animated")) {
							continue;
						}
						if(top + buffer >= blockTop) {
							block.html.addClass("animated");
						}

					}
				}
			},

			animationPage: {
				init: function() {
					var self = this;

					self.homeAnimate();
				},

				homeAnimate: function() {
					var self = this;

					/*if ($sel.body.hasClass("home-page")) {
						$sel.body.removeClass("animate");
						setTimeout(function() {
							$sel.body.addClass("animate");
						}, 500)
					}*/
				},
			},

			mobileMenu:{
				button: $(".header-burger"),
				menu: $(".mobile-menu"),
				close: $(".mobile-menu-close"),

				init: function() {
					var self = this;

					self.button.on("click", function() {
						var btn = $(this);

						if (!btn.hasClass("active")) {
							btn.removeClass("close");
							btn.addClass("active");

							setTimeout(function() {
								btn.addClass("active--hover");
							}, 300);

							self.show(self.menu);
						} else {
							btn.removeClass("active--hover");

							setTimeout(function() {
								btn.removeClass("active");
								btn.addClass("close");
							}, 300);

							self.hide(self.menu);
						}
					});
				},

				show: function(menu) {
					var self = this;

					menu.addClass("active-block");

					setTimeout(function() {

						menu.addClass("active-show");

						$sel.body.addClass("open-menu");

					}, 200);
				},

				hide: function(menu) {
					var self = this;

					menu.removeClass("active-show");

					setTimeout(function() {

						$sel.body.removeClass("open-menu");

					}, 300);

					setTimeout(function() {

						menu.removeClass("active-block");

					}, 600);
				}
			},

			ajaxLoader: function() {
				$sel.body.on("click", ".load-more", function(event) {
					var $linkAddress = $(this),
						href = $linkAddress.attr("href"),
						$container = $($linkAddress.data("container")),
						$items = $linkAddress.data("itemsselector");


					$linkAddress.addClass("loading");

					(function(href, $container, selector, $link) {
						$.ajax({
							url: href,
							success: function(data) {
								var $data = $('<div />').append(data),
									$items = $data.find(selector),
									$preloader = $data.find(".load-more"),
									$linkParent = $link.parent();


								$items.addClass("load-events-item");
								$container.append($items);
								$link.remove();

								if($preloader && $preloader.length) {
									$linkParent.append($preloader);
								}

								setTimeout(function() {
									$container.find(".load-events-item").removeClass("load-events-item");
									$linkAddress.removeClass("loading");
								}, 100);

								setTimeout(function() {
									CHINASTORIES.common.go($items.offset().top-100, 1000);
								}, 300);
							}
						})
					})(href, $container, $items,$linkAddress);
					event.preventDefault();
				})
			},

			sliders: {

				init: function() {
					var self = this,
						$contentSlider = $(".content-slider:not(.owl-carousel)");

					self.slickContentSlider($contentSlider);
					self.owlSlider();
				},

				slickContentSlider: function(slider) {
					var self = this;

					slider.each(function() {
						(function(sliderItem) {
							var	$contentSlider = sliderItem.parents(".content-slider-container"),
								$slider = $contentSlider.find(sliderItem),
								$itemSlider = $(".content-slider-item", sliderItem),
								$arrowContainer = $(".content-slider-arrows", $contentSlider);

							self.sliderEffect($slider, $itemSlider, $arrowContainer, true);
						})($(this));
					});


				},

				sliderEffect: function(slider, itemSlider, arrowContainer, autoplay) {
					var self= this;

					autoplay = autoplay ? true : false;

					if (autoplay) {
						autoplay = true;
						var autoplaySpeed = 300;
					}

					/*if (slider.hasClass("content-slider--big")) {
						slider.slick({
							arrows: true,
							appendArrows: arrowContainer,
							autoplay: autoplay,
	  						autoplaySpeed: autoplaySpeed,
							prevArrow: '<div class="slick-arrow-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.04 74.55"><g data-name="Слой 2"><path d="M78.74 74.55L58.22 36.9 80 0 0 35.89z" fill="#bd1d1d" data-name="Слой 1"/></g></svg></div>',
							nextArrow: '<div class="slick-arrow-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79.8 74.93"><g data-name="Слой 2"><path d="M0 0l21.28 37.47L0 74.93l79.8-37.46z" fill="#bd1d1d" data-name="Слой 1"/></g></svg></div>',						infinite: true,
							speed: 800,
							autoplaySpeed: 6000,
							slidesToShow: 4,
							slidesToScroll: 2,
							responsive: [
								{
									breakpoint: 1600,
									settings: {
										slidesToShow: 3,
										slidesToScroll: 3,
									}
								}, {
									breakpoint: 1225,
									settings: {
										slidesToShow: 2,
										slidesToScroll: 2
									}
								}, {
									breakpoint: 780,
									settings: {
										slidesToShow: 1,
										slidesToScroll: 1
									}
								}
							]
						});
						return;
					}
					*/

					slider.slick({
						arrows: true,
						appendArrows: arrowContainer,
						autoplay: autoplay,
  						autoplaySpeed: autoplaySpeed,
						prevArrow: '<div class="slick-arrow-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.04 74.55"><g data-name="Слой 2"><path d="M78.74 74.55L58.22 36.9 80 0 0 35.89z" fill="#bd1d1d" data-name="Слой 1"/></g></svg></div>',
						nextArrow: '<div class="slick-arrow-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79.8 74.93"><g data-name="Слой 2"><path d="M0 0l21.28 37.47L0 74.93l79.8-37.46z" fill="#bd1d1d" data-name="Слой 1"/></g></svg></div>',
						infinite: true,
						speed: 800,
						slidesToShow: 1,
						autoplaySpeed: 6000,
					});




					itemSlider.on("mousedown", function() {
						item = $(this);
						item.css("cursor", "-webkit-grab");
					})

					itemSlider.on("mouseup", function() {
						item = $(this);
						item.css("cursor", "pointer");
					})

				},

				owlSlider: function() {
					var self = this,
						owlSlider = $('.owl-carousel'),
						arrow = owlSlider.parent().find(".content-slider-arrows");

					$sel.window.on("load", function() {

						$('.owl-carousel').owlCarousel({
							margin: 0,
							loop: true,
							autoWidth: true,
							items: 4,
							navContainer: arrow,
							nav: true,
							smartSpeed: 1000,
							navText: ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.04 74.55"><g data-name="Слой 2"><path d="M78.74 74.55L58.22 36.9 80 0 0 35.89z" fill="#bd1d1d" data-name="Слой 1"/></g></svg>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79.8 74.93"><g data-name="Слой 2"><path d="M0 0l21.28 37.47L0 74.93l79.8-37.46z" fill="#bd1d1d" data-name="Слой 1"/></g></svg>'],
							responsive : {
								0: {
									items: 1,
									autoWidth: false,
								},
								780: {
									items: 2,
								},
								1200: {
									items: 4,
								},
								1600: {
									items: 5,
								}
							}
						});

					});
				}
			},

			maps: {
				init: function() {
					$(".map", $sel.body).each(function() {
						var $map = $(this),
							lng = parseFloat($map.data("lng"), 10) || 0,
							lat = parseFloat($map.data("lat"), 10) || 0,
							zoom = parseInt($map.data("zoom"));

						var options = {
							center: new google.maps.LatLng(lat, lng),
							zoom: zoom,
							mapTypeControl: false,
							panControl: false,
							zoomControl: true,
							zoomControlOptions: {
								style: google.maps.ZoomControlStyle.LARGE,
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							scaleControl: true,
							streetViewControl: true,
							streetViewControlOptions: {
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							styles: [
								{"featureType": "landscape", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "poi", "stylers": [
									{"saturation": -300},
									{"lightness": -10},
									{"visibility": "simplified"}
								]},
								{"featureType": "road.highway", "stylers": [
									{"saturation": -100},
									{"visibility": "simplified"}
								]},
								{"featureType": "road.arterial", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "road.local", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "transit", "stylers": [
									{"saturation": -100},
									{"visibility": "simplified"}
								]},
								{"featureType": "administrative.province", "stylers": [
									{"visibility": "off"}
								]},
								{"featureType": "water", "elementType": "labels", "stylers": [
									{"visibility": "on"},
									{"lightness": -25},
									{"saturation": -100}
								]},
								{"featureType": "water", "elementType": "geometry", "stylers": [
									{"hue": "#ffff00"},
									{"lightness": -25},
									{"saturation": -97}
								]}
							]
						};

						var iconMap= {
							url: $map.data("icon"),
							size: new google.maps.Size(45, 65),
						};
						var api = new google.maps.Map($map[0], options);
						var point = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lng),
							map: api,
							icon: $map.data("icon")
						});

					});
				}
			},

			forms: {

				init: function($form) {
					var self = this;

					if (!$form) {
						var $form = $sel.body;
					}

					self.validateForm();
					self.replaceStandartInputs($form);
					self.reloadJcf($(".form"));

					// step form initialization
					$form.each(function() {
						(function(form) {
							self.stepForm.init(form);
						})($(this));
					});


				},

				validateForm: function() {
					var self = this;

					$(".form", $sel.body).each(function() {
						(function($form) {
							var $formFields = $form.find("[data-error]"),
								formParams = {
									rules: {
									},
									messages: {
									}
								};

							$.validator.addMethod("mobileRU", function(phone_number, element) {
								phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
								return this.optional(element) || phone_number.length > 5 && phone_number.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{6,10}$/);
							}, "Error");

							$formFields.each(function() {
								var $field = $(this),
									fieldPattern = $field.data("pattern"),
									fieldError = $field.data("error");
								if(fieldError) {
									formParams.messages[$field.attr("name")] = $field.data("error");
								} else {
									formParams.messages[$field.attr("name")] = "Ошибка заполнения";
								}
								if(fieldPattern) {
									formParams.rules[$field.attr("name")] = {};
									formParams.rules[$field.attr("name")][fieldPattern] = true;
								}
							});

							$("[data-number]", $form).each(function() {
								var $item = $(this);
								$item.mask($item.data("number"));
							});

							if($form.data("success")) {

								formParams.submitHandler = function(form) {

									var options = {
										type: "ajax",
										bcgcolor: "#BD1D1D",
										customclass: "form-step-container",
										btnclosetml: '<button data-lazymodal-close class="lazy-modal-close">'+
														'<span class="form-close"></span>'+
													 '</button>',
										positionclose: "outside",
										init: function(obj) {
											obj.options.htmlContent = $(".form-success", obj.options.htmlContent);
										},
									};
									$.lazymodal.open($("button[type=submit]", $form), options, $form.data("success"));
								};
							}
							$form.validate(formParams);

						})($(this))
					});
				},

				replaceStandartInputs: function($form) {
					var $selects = $("select", $form),
						$numbers = $("input[type=number]", $form);

					jcf.setOptions("Select", {
						wrapNative: false,
						wrapNativeOnMobile: true,
						maxVisibleItems: 6,
					});

					jcf.setOptions("Number", {
						pressInterval: "150",
						disabledClass: "jcf-disabled"
					});


					$selects.each(function() {
						var $select = $(this);
						jcf.replace($select);
					});

					$numbers.each(function() {
						var $number = $(this);

						jcf.replace($number);
					});

				},

				reloadJcf: function($form) {

					$form.submit(function(event) {
						var form = $(event.target),
							$formItems = $form.find(".form-item");

						$formItems.each(function() {
							(function(el) {
								jcf.refresh(el);
							})($(this))
						});

					});

				},

				stepForm: {
					form: false,

					activeFormItem: false,

					firstInit: true,

					stepFormFontainer: "",

					step: "",

					stepText: "",

					resultForm: "",

					resultFormText: "",

					resultFormTmpl: "",

					finalText: "",

					init: function(form) {
						var self = this;

						self.form = form;

						self.activeFormItem = false;

						self.firstInit = true;

						self.stepFormFontainer = $(".form-steps", self.form);

						self.step = $(".form-steps", self.form).data("formstep");

						self.stepText = $(".form-step-text", self.form);

						self.resultForm = $(".form-result-info", self.form);

						self.resultFormText = self.resultForm.data("formresult");

						self.resultFormTmpl = self.resultForm.data("formrestmpl");

						self.finalText = self.resultForm.data("finaltext");

						setTimeout(function() {
							self.stepFormFontainer.removeClass("preload");
						}, 300);

						self.setStep();
						self.changeStep(form);
					},

					setStep: function() {
						var self = this,
							$allFormStep = $(".form-step:not(.form-step--"+self.step+")", self.stepFormFontainer),
							$activeFormStep = $(".form-step--"+self.step, self.stepFormFontainer);

						if (self.firstInit) {

							$allFormStep.each(function() {
								(function(el) {
									el.addClass("disabled");
								})($(this));
							});

							self.firstInit = false;

						} else {

							$allFormStep.each(function() {
								(function(el) {
									el.addClass("hide-show");

									setTimeout(function() {
										el.addClass("disabled");
									}, 300);

								})($(this));
							});

							$activeFormStep.removeClass("disabled");

							setTimeout(function() {
								$activeFormStep.removeClass("hide-show");
							}, 400);

						}

						self.stepText.each(function() {
							(function(el) {
								var elText = el.data("steptext"),
									changeText = elText.replace(/\{\w*\}/, self.step);
									changeTextData = elText.replace(/\{\w*\}/, "{"+self.step+"}");

								el.text(changeText);
								el.attr("data-steptext", changeTextData);

							})($(this));
						});

						(function(activeForm) {
							self.activeFormItem = activeForm.find(".form-item");
							self.watchChanges();
						})($activeFormStep);

					},

					changeStep: function() {
						var self = this,
							$buttonStepNext = $("[data-nextstep]"),
							$buttonStepPrev = $("[data-prevstep]");

						$buttonStepNext.each(function() {
							(function(el) {
								el.on("click", function(e) {
									var button = $(this),
										buttonStepNumber = button.data("nextstep"),
										$currentElements = $(".form-step--"+self.step, button.closest(".form")).find("[data-error]");

									if ($currentElements.valid()) {
										self.step = buttonStepNumber;
										self.setStep();
									} else {
										self.activeFormItem.each(function() {
											if ($(this).hasClass("form-item--select") || $(this).hasClass("form-item--number")) {
												(function(el) {
													jcf.refresh(el);
												})($(this))
											}
										});
									}

								});
							})($(this));
						})
						$buttonStepPrev.each(function() {
							(function(el) {
								el.on("click", function(e) {
									var button = $(this),
										buttonStepNumber = button.data("prevstep");

									self.step = buttonStepNumber;
									self.setStep();
									e.preventDefault();
								});

							})($(this));
						})

					},

					watchChanges: function() {
						var self = this;

						self.activeFormItem.each(function() {
							(function(elementsForm, self) {
								elementsForm.on("change", function() {
									var el = $(this),
										idEL = el.attr("id");

									self.resultFormText[idEL] = el.val();

									self.resultForm.attr("data-formresult", JSON.stringify(self.resultFormText));

									if (el.hasClass("form-item--select") || el.hasClass("form-item--number")) {
										jcf.refresh(el);
									}

									self.finalText = self.resultFormTmpl;

									for (var key in self.resultFormText) {
										if (self.resultFormText[key] !== "" && self.resultFormTmpl.indexOf(key) !== -1) {
											self.finalText = self.finalText.replace("{"+key+"}",self.resultFormText[key]);
										}
									}

									self.resultForm.text(self.finalText);

								});
							})($(this), self)
						});

					}

				},

				modalWindow: function() {
					$(".open-form[data-lazymodal]").lazyModal({
						type: "ajax",
						bcgcolor: "#BD1D1D",
						init: function(obj) {
							obj.options.htmlContent = $("#step-form", obj.options.htmlContent);
						},
						afterImplant: function(obj) {
							obj.options.htmlStructure.contentContainer.append('<button data-lazymodal-close class="lazy-modal-close lazy-modal-close-mobile"><span class="form-close"></span></button>');
							CHINASTORIES.forms.init(obj.options.htmlContent.find(".form"));
						},
						customclass: "form-step-container",
						btnclosetml: '<button data-lazymodal-close class="lazy-modal-close">'+
										'<span class="form-close"></span>'+
									 '</button>',
						positionclose: "outside",
					});

				}

			},



		};

	})();

	CHINASTORIES.mobileMenu.init();
	CHINASTORIES.sliders.init();
	CHINASTORIES.maps.init();
	CHINASTORIES.forms.modalWindow();
	CHINASTORIES.forms.init();
	CHINASTORIES.animationPage.init();
	CHINASTORIES.ajaxLoader();

})(jQuery);
