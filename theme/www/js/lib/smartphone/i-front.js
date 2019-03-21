Util.Objects["front"] = new function() {
	this.init = function(scene) {

		scene.resized = function() {
			// u.bug("scene.resized:", this);

			// Check if landscape
			if (!page.is_landscape && window.innerWidth > window.innerHeight) {
				page.is_landscape = true;

				// Set top div height
				u.ass(this.top_div, {
					"height":(window.innerHeight - page.hN.offsetHeight) + "px",
					"margin-top":page.hN.offsetHeight + "px"
				});
				
				// Only show fullscreen slideshow if it was visible in potrait mode
				if(!this.slideshow_showcase.is_fullscreen && this.slideshow_showcase.is_visible) {

					// Update internal state
					this.slideshow_showcase.is_fullscreen = true;

					// Disable body scroll
					u.ass(document.body, {
						"overflow-y":"hidden"
					});

					// Hide elements
					u.ass(page.hN, {
						"display":"none"
					});

					u.ass(this.turn, {
						"display":"none"
					});

					// Make slideshow fullscreen
					u.ac(this.slideshow_showcase, "fullscreen");
				}
				else {
					u.ass(this.turn, {
						"display":"none"
					});
				}
			}
			else if (page.is_landscape && window.innerWidth <= window.innerHeight) {
				page.is_landscape = false;

				// Set top div height
				u.ass(this.top_div, {
					"height":(window.innerHeight - page.hN.offsetHeight) + "px",
					"margin-top":page.hN.offsetHeight + "px"
				});

				
				u.ass(this.turn, {
					"display":"block"
				});

				// Only hide slideshow if in fullscreen mode
				if (this.slideshow_showcase.is_fullscreen && this.slideshow_showcase.is_visible) {

					// Update internal state
					this.slideshow_showcase.is_fullscreen = false;

					// Enable body scroll
					u.ass(document.body, {
						"overflow-y":"scroll"
					});

					// Show elements
					u.ass(page.hN, {
						"display":"block"
					});

					
					u.ass(this.turn, {
						"display":"block"
					});
					
					// Remove fullscreen state
					u.rc(this.slideshow_showcase, "fullscreen");
				}

			}

			
			// Get cover and set width
			u.ass(this.cover, {
				"width":u.browserW()+"px",
				"margin-left":-((u.browserW()-this.top_div.offsetWidth) / 2)+"px"
			});

			// Set height of dobbl
			u.ass(this.dobbl_beach, {
				"height":(this.dobbl_beach.offsetWidth / 0.4646) + "px"
			});

			// Set height of locations image box
			u.ass(this.box_retreat, {
				"height":(this.box_retreat.offsetWidth / 0.9293) + "px"
			});

			// Set height of ul
			u.ass(this.ul_showcase, {
				"height":(this.ul_showcase.offsetWidth / 1.7768) + "px"
			});
			this.slideshow_showcase.resized();

			// Set height of ul
			u.ass(this.ul_plans, {
				"height":(this.ul_plans.offsetWidth / 0.7218) + "px"
			});
			this.slideshow_plans.resized();

		}

		scene.scrolled = function() {
			// u.bug("scene.scrolled:", this);

			// Animate containers elements
			for(var i = 0; i < this.containers.length; i++) {

				var container = this.containers[i];

				// Only do check if container hasn't been shown
				if(!container.is_visible) {
					
					// Show container when in view
					if (this.visible(container)) {
						container.is_visible = true;
						u.ac(container, "visible");
					}

				}
				
			}

			// Check and update state of slideshow showcase
			if (this.visible(this.slideshow_showcase)) {
				this.slideshow_showcase.is_visible = true;
			}
			else {
				this.slideshow_showcase.is_visible = false;
			}

		}

		scene.ready = function() {
			// u.bug("scene.ready:", this);

			// enable callbacks from resized and scrolled
			page.cN.scene = this;

			// Function that detects wether or not element is in view;
			this.visible = function(e) {
				// Get elements coordinates from window view
				var bounding = e.getBoundingClientRect();

				// Assigning element top and bottom for comparison
				var top = bounding.top;
				var bottom = bounding.bottom;

				// Get height of navigation bar for compensation
				var navHeight = page.hN.offsetHeight;

				// Get supported version of window height depending on browser
				var windowHeight = (window.innerHeight || document.documentElement.clientHeight);

				// If either top or bottom is bigger than 0 offset by navigations height and top is under window height,
				// then return true. Else return false.
				return (
					(top > 0 + navHeight || bottom > 0 + navHeight)
					&&
					top < windowHeight
				);
			}

			// Image injector
			this.injectImage = function(e, src, alt) {
				u.ae(e, "img", {"src": src, "alt":alt});
			}

			// Get top image and set it's height
			this.top_div = u.qs("#landing", this);
			this.cover = u.qs("#landing .cover", this.top_div);


			// Preload cover image
			u.preloader(this.top_div, [
				"/img/smartphone/top.jpg"
			]);

			// When cover image is loaded
			this.top_div.loaded = function(queue) {

				// Set top div height
				u.ass(this, {
					"height":(window.innerHeight - page.hN.offsetHeight) + "px",
					"margin-top":page.hN.offsetHeight + "px"
				});

				// Show page
				u.a.transition(page, "opacity 1s ease");
				u.ass(page, {
					"opacity":1
				});

			}

			// Set create references to dobbl boxes
			this.dobbl_beach = u.qs(".dobbl.beach", this);
			this.box_retreat = u.qs(".dobbl.locations > .image", this);


			// Apply footer height to scene as bottom margin, to create footer reveal effect
			u.ass(this, {
				"margin-bottom":(footer.offsetHeight - 1) + "px"
			});

			// Get elements to "push"
			this.containers = u.qsa(".container");
		
			// Landig arrow scroll
			this.landing_arrow = u.qs(".landing-arrow", this);
			u.ce(this.landing_arrow);
			this.landing_arrow.clicked = function() {

				// Get only #{target}
				var anchor = this.url.replace(/[^#]+/,"");

				// Get target element
				var target = u.qs(anchor);

				// Get targets position
				var target_pos = u.absY(target);

				// Check if smooth scroll behavior is supported
				if ('scrollBehavior' in document.documentElement.style) {
					window.scrollTo({top:target_pos - 75, behavior: 'smooth'});
				}
				// Old version of scrollTo supported in most browsers
				else {
					window.scrollTo(0, target_pos - 75);
				}
			}

			// Get showcase image list
			this.ul_showcase = u.qs("ul.slideshow.showcase", this);
			if(this.ul_showcase) {
				
				// Create new slideshow (with index)
				this.slideshow_showcase = u.slideshow(this.ul_showcase, {index:true});

				// Set height of ul
				u.ass(this.ul_showcase, {
					"height":(this.ul_showcase.offsetWidth / 1.7768) + "px"
				});

				// Slides are preloaded
				this.slideshow_showcase.preloaded = function() {
					// select current node (first slide if none specified)
					if(!this.selected_node) {
						this.selectNode(0);
					}
				}

				// Inject turn symbol
				this.turn = u.ae(this.slideshow_showcase, "div", {"class":"turn"});


				this.slideshow_showcase.inputStarted = function(event) {
					// u.bug("nodeSelected:", node);

					// Only execute if slideshow is fullscreen
					if(this.is_fullscreen) {
						// Prevent browser chrome from appearing
						u.e.kill(event);
					}
				}
				this.slideshow_showcase.nodeSelected = function(node) {
					// u.bug("nodeSelected:", node);
				}
				this.slideshow_showcase.nodeEntered = function(node) {
					// u.bug("nodeEntered:", node);
				}
				this.slideshow_showcase.nodeCleared = function(node) {
					// u.bug("nodeCleared:", node);
				}
				// Start slideshow setup
				this.slideshow_showcase.prepare();

			}

			// Get plan image list
			this.ul_plans = u.qs("ul.slideshow.plans", this);
			if(this.ul_plans) {
				
				// Create new slideshow (with index)
				this.slideshow_plans = u.slideshow(this.ul_plans, {index:true});

				// Set height of ul
				u.ass(this.ul_plans, {
					"height":(this.ul_plans.offsetWidth / 0.7218) + "px"
				});

				// Slides are preloaded
				this.slideshow_plans.preloaded = function() {
					// select current node (first slide if none specified)
					if(!this.selected_node) {
						this.selectNode(0);
					}

				}

				this.slideshow_plans.nodeSelected = function(node) {
					// u.bug("nodeSelected:", node);
				}
				this.slideshow_plans.nodeEntered = function(node) {
					// u.bug("nodeEntered:", node);
				}
				this.slideshow_plans.nodeCleared = function(node) {
					// u.bug("nodeCleared:", node);
				}
				// Start slideshow setup
				this.slideshow_plans.prepare();

			}

			// Inject images
			this.initImages();

			// Ensure sizing is applied
			this.scrolled();
			this.resized();
		}

		scene.initImages = function() {
			// # Backgrounds

			// Nav
			this.logo = u.qs("#header ul.servicenavigation");
			u.ass(this.logo, {
				"background": "url(/img/logo.svg) no-repeat center center",
				"background-size": "contain"
			});

			this.zoom = u.qs(".zoom", this.cover);
			u.ass(this.zoom, {
				"background": "url(/img/smartphone/top.jpg) no-repeat center center",
				"background-size": "cover"
			});

			// Dobbbl boxes
			this.locations = u.qs(".locations", this);

			this.locations_text = u.qs(".text", this.locations);
			u.ass(this.locations_text, {
				"background": "url(/img/darkpattern.png)",
			});
			this.locations_retreat = u.qs(".image", this.locations);
			u.ass(this.locations_retreat, {
				"background": "url(/img/smartphone/retreat.jpg) no-repeat center center",
				"background-size": "cover"
			});

			this.beach = u.qs(".beach", this);

			this.beach_text = u.qs(".text", this.beach);
			u.ass(this.beach_text, {
				"background": "url(/img/smartphone/darkwood.jpg) no-repeat center center",
				"background-size": "cover"
			});
			this.beach_girl = u.qs(".image", this.beach);
			u.ass(this.beach_girl, {
				"background": "url(/img/smartphone/beachgirl.jpg) no-repeat center center",
				"background-size": "cover"
			});


			// Money pattern
			this.money = u.qs("#money", this);
			u.ass(this.money, {
				"background": "url(/img/lightpattern.png)",
			});

			// Footer pattern
			this.footer_container = u.qs("#footer .container");
			u.ass(this.footer_container, {
				"background": "url(/img/darkpattern.png)",
			});

			// # Injections

			// Landing arrow image
			this.landing_anchor = u.qs(".landing-arrow a", this.landing_arrow);
			this.injectImage(this.landing_anchor, "/img/arrow.png", "arrow");

			// Divider images
			this.dividers = u.qsa(".divider", this);
			for(var i = 0; i < this.dividers.length; i++) {
				this.injectImage(this.dividers[i], "/img/divider.png", "divider");
			}

			// Bottom image
			this.bottom = u.qs("#bottom", this);
			this.injectImage(this.bottom, "/img/smartphone/bottom.jpg", "last impression");

		}

		scene.ready();
	}
}
